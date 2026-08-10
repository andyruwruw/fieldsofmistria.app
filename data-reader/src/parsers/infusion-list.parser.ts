// Packages
import type { Element } from 'domhandler';

// Local Imports
import { BASE_URL } from '../config';
import { Parser } from './parser';

// Types
import {
  Infusion,
  InfusionCategory,
  InfusionReference,
} from '../models/infusions';

/**
 * The infusion tables all share the same column layout:
 * icon | name | effect | valid items | pre-infused items | requirement.
 */
const COLUMN_COUNT = 6;

/**
 * A single infusion table's pending rowspans, tracked per column so cells
 * that span multiple rows (e.g. a shared "Valid Items" category) are
 * carried down into the rows that don't repeat them in the markup.
 */
interface PendingSpan {
  value: unknown;
  remaining: number;
}

/**
 * Parses the Infusion wiki page. Everything lives on a single page as four
 * tables (Blacksmithing, Cooking, Woodcrafting, Other Infusions) with an
 * identical column layout, so there are no per-infusion detail pages to
 * fetch, this parser returns the full `Infusion[]` list directly.
 */
export class InfusionListParser extends Parser<Infusion[]> {
  /**
   * Parses the HTML page and returns structured data.
   *
   * @returns {Promise<Infusion[]>} A promise that resolves to the parsed data.
   */
  async parse(): Promise<Infusion[]> {
    const categoryByHeading: Record<string, InfusionCategory> = {
      'Blacksmithing': 'Blacksmithing',
      'Cooking': 'Cooking',
      'Woodcrafting': 'Woodcrafting',
      'Other Infusions': 'Other',
    };

    const $ = this._page;
    const content = this._getFirst('div.mw-content-ltr');
    const contents = content.children().toArray();

    const infusions: Infusion[] = [];
    let currentCategory: InfusionCategory | null = null;

    // Each infusion table directly follows the h2 heading for its
    // category, so walk the page's top-level children tracking the most
    // recent heading and grab the next table once we're under one we care
    // about. (Headings here wrap an icon <a><img></a> before the text,
    // which trips up the generic `_firstTagAfterTag` heuristics, hence the
    // manual walk.)
    for (const node of contents) {
      if (node.type !== 'tag') {
        continue;
      }

      if (node.name === 'h2') {
        const heading = $(node).find('span.mw-headline').text().trim();

        currentCategory = categoryByHeading[heading] || null;
        continue;
      }

      if (node.name === 'table' && currentCategory) {
        infusions.push(...this._parseCategoryTable(
          node,
          currentCategory,
        ));

        currentCategory = null;
      }
    }

    return infusions;
  }

  /**
   * Parses a single category's infusion table, resolving rowspans so
   * shared cells (Valid Items, Requirements, etc.) are copied onto every
   * row they cover.
   *
   * @param {Element} table The `<table>` element for this category.
   * @param {InfusionCategory} category The category this table represents.
   * @returns {Infusion[]} The infusions found in this table.
   */
  _parseCategoryTable(
    table: Element,
    category: InfusionCategory,
  ): Infusion[] {
    const $ = this._page;
    const rows = $(table).find('> tbody > tr').toArray();
    const pending: (PendingSpan | null)[] = new Array(COLUMN_COUNT).fill(null);
    const infusions: Infusion[] = [];

    for (const row of rows) {
      const cells = $(row).children('td').toArray();

      // Header rows use <th>, so they have no <td> children and nothing pending.
      if (cells.length === 0 && pending.every((span) => (!span))) {
        continue;
      }

      const values: unknown[] = new Array(COLUMN_COUNT).fill(undefined);
      let cellIndex = 0;

      for (let column = 0; column < COLUMN_COUNT; column += 1) {
        const span = pending[column];

        if (span && span.remaining > 0) {
          values[column] = span.value;
          span.remaining -= 1;

          if (span.remaining === 0) {
            pending[column] = null;
          }

          continue;
        }

        if (cellIndex >= cells.length) {
          break;
        }

        const cell = cells[cellIndex];
        cellIndex += 1;

        const value = this._parseCell(
          $,
          cell,
          column,
        );

        values[column] = value;

        const rowspan = parseInt($(cell).attr('rowspan') || '1', 10) || 1;

        if (rowspan > 1) {
          pending[column] = {
            value,
            remaining: rowspan - 1,
          };
        }
      }

      const name = values[1] as string;

      if (!name) {
        continue;
      }

      const image = values[0] as string;
      const effect = values[2] as string;
      const validItems = values[3] as InfusionReference | null;
      const preInfusedItems = values[4] as InfusionReference[];
      const requirement = values[5] as InfusionReference;

      infusions.push({
        id: `${category.toLowerCase()}-${name.toLowerCase().replace(/\s+/g, '-')}`,
        name,
        category,
        image: image || '',
        effect: effect || '',
        validItems: validItems || null,
        preInfusedItems: preInfusedItems || [],
        requirement: requirement || {
          name: '',
          href: '',
          icon: '',
        },
        href: this._url,
      });
    }

    return infusions;
  }

  /**
   * Parses a single `<td>` based on which column it belongs to.
   *
   * @param $ The Cheerio API instance.
   * @param {Element} cell The `<td>` element to parse.
   * @param {number} column The column index (0 = icon, 1 = name, 2 = effect,
   * 3 = valid items, 4 = pre-infused items, 5 = requirement).
   * @returns {unknown} The parsed value for this cell.
   */
  _parseCell(
    $: any,
    cell: Element,
    column: number,
  ): unknown {
    switch (column) {
      case 0:
        return this._extractIcon($, cell);
      case 1:
        return $(cell).text().trim();
      case 2:
        return $(cell).text().trim().replace(/\s+/g, ' ');
      case 3:
        return this._extractReference($, cell);
      case 4:
        return this._extractReferenceList($, cell);
      case 5:
        return this._extractRequirement($, cell);
      default:
        return undefined;
    }
  }

  /**
   * Extracts an icon image URL from the first `<img>` found in a cell.
   *
   * @param $ The Cheerio API instance.
   * @param {Element} cell The cell to search.
   * @returns {string} The full icon URL, or an empty string if none found.
   */
  _extractIcon(
    $: any,
    cell: Element,
  ): string {
    const src = $(cell).find('img').first().attr('src');

    return src ? `${BASE_URL}${src}` : '';
  }

  /**
   * Extracts a single reference (icon + link) from a cell, such as the
   * "Valid Items" category link.
   *
   * @param $ The Cheerio API instance.
   * @param {Element} cell The cell to search.
   * @returns {InfusionReference | null} The parsed reference, or null if the cell is empty.
   */
  _extractReference(
    $: any,
    cell: Element,
  ): InfusionReference | null {
    const link = $(cell).find('a').first();

    if (link.length === 0) {
      const text = $(cell).text().trim();

      return text ? {
        name: text,
        href: '',
        icon: this._extractIcon($, cell),
      } : null;
    }

    const href = link.attr('href') || '';
    const name = link.text().trim() || link.attr('title') || '';

    return {
      name,
      href: href ? `${BASE_URL}${href}` : '',
      icon: this._extractIcon($, cell),
    };
  }

  /**
   * Extracts the "Requirements to Craft" cell, which is either a skill
   * perk reference or plain text (e.g. "Uncraftable").
   *
   * @param $ The Cheerio API instance.
   * @param {Element} cell The cell to search.
   * @returns {InfusionReference} The parsed requirement.
   */
  _extractRequirement(
    $: any,
    cell: Element,
  ): InfusionReference {
    return this._extractReference(
      $,
      cell,
    ) || {
      name: '',
      href: '',
      icon: '',
    };
  }

  /**
   * Extracts a list of references from a cell that can contain multiple
   * items (e.g. several pre-infused items separated by `<br>`). Each item
   * is rendered as two `<a>` tags sharing an href, one wrapping the icon
   * and one wrapping the text, so they're merged back together by href.
   *
   * @param $ The Cheerio API instance.
   * @param {Element} cell The cell to search.
   * @returns {InfusionReference[]} The parsed references.
   */
  _extractReferenceList(
    $: any,
    cell: Element,
  ): InfusionReference[] {
    const byHref = new Map<string, InfusionReference>();
    const order: string[] = [];

    $(cell).find('a').each((_index: number, link: Element) => {
      const $link = $(link);
      const href = $link.attr('href') || '';
      const key = href || $link.text().trim();

      if (!key) {
        return;
      }

      if (!byHref.has(key)) {
        byHref.set(key, {
          name: '',
          href: href ? `${BASE_URL}${href}` : '',
          icon: '',
        });
        order.push(key);
      }

      const reference = byHref.get(key)!;
      const text = $link.text().trim() || $link.attr('title') || '';

      if (text) {
        reference.name = text;
      }

      const icon = $link.find('img').first().attr('src');

      if (icon) {
        reference.icon = `${BASE_URL}${icon}`;
      }
    });

    return order.map((key) => (byHref.get(key)!)).filter((reference) => (!!reference.name));
  }
}
