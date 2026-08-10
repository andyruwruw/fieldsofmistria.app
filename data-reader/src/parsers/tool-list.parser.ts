// Packages
import { Cheerio } from 'cheerio';

// Local Imports
import { convertTesseraeString } from '../utils/convert';
import { BASE_URL } from '../config';
import { Parser } from './parser';

// Types
import { ToolTier, ToolType } from '../models/tools';

/**
 * Maps the wiki's Tools page section headings to a ToolType.
 */
const SECTION_TYPES: Record<string, ToolType> = {
  Pickaxes: 'pickaxe',
  Axes: 'axe',
  Hoes: 'hoe',
  'Watering Cans': 'watering-can',
  'Fishing Rods': 'fishing-rod',
  Shovels: 'shovel',
  'Bug Nets': 'bug-net',
};

/**
 * A single cell resolved from a table, accounting for rowspan/colspan merges.
 */
interface ResolvedCell {
  element: Cheerio<any>;
}

/**
 * Parses the main Tools list page to extract, per tool-type table
 * (Pickaxes/Axes/Hoes/Watering Cans/Fishing Rods/Shovels/Bug Nets), the
 * per-tier tool URLs plus the fields that only live on the list page
 * (charge/cast range, tesserae cost, and the human-readable "source"
 * description) since `_parseAside()` intentionally drops the "Sources"
 * field on individual tool pages.
 */
export class ToolListParser extends Parser<Record<string, string>[]> {
  /**
   * Leftover data from previous parsing attempts, keyed by tool id.
   * Used by ToolPageParser to look up list-page-only fields.
   */
  static _data = {} as Record<string, Record<string, string>>;

  /**
   * Parses the HTML page and returns structured data.
   *
   * @returns {Promise<Record<string, string>[]>} A promise that resolves to the parsed data.
   */
  async parse(): Promise<Record<string, string>[]> {
    const results: Record<string, string>[] = [];

    const headings = this._get('#mw-content-text h3').filter(
      (_i: number, el: any) => (SECTION_TYPES[this._page(el).text().trim()] !== undefined),
    );
    const tables = this._get('#mw-content-text table.wikitable.mw-collapsible.sortable');

    for (let i = 0; i < tables.length; i += 1) {
      const heading = headings.eq(i).text().trim();
      const type = SECTION_TYPES[heading];

      if (!type) {
        continue;
      }

      const table = tables.eq(i);
      const rows = this._parseToolTable(table, type);

      for (const row of rows) {
        results.push(row);
        ToolListParser._data[row.id] = row;
      }
    }

    return results;
  }

  /**
   * Looks up the charge/cast range for a tool by id.
   *
   * @param {string} id The tool's id.
   * @returns {string} The tool's charge/cast range, or an empty string if unknown.
   */
  static getChargeRange(id: string): string {
    return this._data[id]?.chargeRange || '';
  }

  /**
   * Looks up the tesserae cost for a tool by id.
   *
   * @param {string} id The tool's id.
   * @returns {number} The tool's cost, or 0 if unknown/unbuyable.
   */
  static getCost(id: string): number {
    return convertTesseraeString(this._data[id]?.cost || '', 0);
  }

  /**
   * Looks up the human-readable source description for a tool by id.
   *
   * @param {string} id The tool's id.
   * @returns {string} The tool's source description.
   */
  static getSource(id: string): string {
    return this._data[id]?.source || '';
  }

  /**
   * Parses a single tool-type table (e.g. Pickaxes), resolving rowspan/colspan
   * merges so that each tool tier ends up with a full, independent row.
   *
   * @param {Cheerio<any>} table The table to parse.
   * @param {ToolType} type The tool type this table represents.
   * @returns {Record<string, string>[]} The parsed rows.
   */
  _parseToolTable(table: Cheerio<any>, type: ToolType): Record<string, string>[] {
    const rows = table.find('tbody > tr');
    const headerCells = rows.eq(0).find('th');
    const headers = headerCells.map((i: number, th: any) => (this._page(th).text().trim())).get() as unknown as string[];
    const numCols = headers.length;

    const nameCol = headers.indexOf('Name');
    const rangeCol = headers.indexOf('Max Charged Range');
    const costCol = headers.indexOf('Cost');
    const sourceCol = headers.indexOf('Sources') !== -1 ? headers.indexOf('Sources') : headers.indexOf('Source');

    const pending = new Array(numCols).fill(null) as ({ element: Cheerio<any>; remaining: number } | null)[];
    const results: Record<string, string>[] = [];

    for (let r = 1; r < rows.length; r += 1) {
      const row = rows.eq(r);
      const tds = row.find('> td');

      if (tds.length === 0) {
        continue;
      }

      const resolved: (ResolvedCell | null)[] = new Array(numCols).fill(null);
      let tdIndex = 0;

      for (let col = 0; col < numCols; col += 1) {
        const pendingCell = pending[col];

        if (pendingCell && pendingCell.remaining > 0) {
          resolved[col] = { element: pendingCell.element };
          pendingCell.remaining -= 1;

          if (pendingCell.remaining === 0) {
            pending[col] = null;
          }

          continue;
        }

        const td = tds.eq(tdIndex);
        tdIndex += 1;

        if (td.length === 0) {
          continue;
        }

        const colspan = parseInt(td.attr('colspan') || '1', 10);
        const rowspan = parseInt(td.attr('rowspan') || '1', 10);

        for (let c = col; c < col + colspan && c < numCols; c += 1) {
          resolved[c] = { element: td };

          if (rowspan > 1) {
            pending[c] = {
              element: td,
              remaining: rowspan - 1,
            };
          }
        }

        col += colspan - 1;
      }

      const nameCell = nameCol !== -1 ? resolved[nameCol] : null;
      const link = nameCell?.element.find('a').first();
      const name = link?.text().trim() || nameCell?.element.text().trim() || '';
      const href = link?.attr('href') ? `${BASE_URL}${link.attr('href')}` : '';

      if (!name || !href) {
        continue;
      }

      const id = name.toLowerCase().replace(/\s+/g, '-').trim();
      const tier = name.split(' ')[0].toLowerCase() as ToolTier;

      results.push({
        id,
        name,
        href,
        type,
        tier,
        chargeRange: rangeCol !== -1 ? (resolved[rangeCol]?.element.text().trim().replace(/\s+/g, ' ') || '') : '',
        cost: costCol !== -1 ? (resolved[costCol]?.element.text().trim().replace(/\s+/g, ' ') || '') : '',
        source: sourceCol !== -1 ? (resolved[sourceCol]?.element.text().trim().replace(/\s+/g, ' ') || '') : '',
      });
    }

    return results;
  }
}
