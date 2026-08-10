// Packages
import { Cheerio } from 'cheerio';

// Local Imports
import { Parser } from './parser';

// Types
import { QuestType } from '../models/quests';

/**
 * Converts a display name into the repo's slug-id convention.
 *
 * @param {string} name - The display name to slugify.
 * @returns {string} The slugified id.
 */
const toId = (name: string): string => name.trim().toLowerCase().replace(/\s+/g, '-');

/**
 * Maps a section heading on the Quests page to the wiki's own categorization
 * for the quests listed under it.
 */
const SECTION_TYPES: Record<string, QuestType> = {
  'Introductory Quests': 'story',
  "Mines' Progression Quests": 'story',
  'Town Improvement Quests': 'story',
  'Festival Quests': 'festival',
  'Important Quests': 'important',
  'Heart Quests': 'heart',
  'Requests': 'request',
  'Special Requests': 'special-request',
  'Crown Requests': 'crown-request',
  'Cooking Challenges': 'cooking-challenge',
};

/**
 * A single quest row, resolved from its table (rowspan cells carried
 * forward into every row they cover), cached for `QuestPageParser` to read
 * back without needing a second page fetch (quests don't have individual
 * wiki pages; they're all rows in tables on the single Quests page).
 */
export interface RawQuestRow {
  id: string;
  name: string;
  type: QuestType;
  section: string;
  anchor: string;
  cells: Record<string, Cheerio<any> | null>;
}

/**
 * Parses the main Quests page. Because quests are all rows in tables on
 * this one page (organized into sections like "Festival Quests" referenced
 * elsewhere as `/wiki/Quests#Festival_Quests`) rather than having individual
 * pages, this parser does the full extraction in one pass: it resolves each
 * table (including rowspan-shared cells like the "Requester"/"Character"
 * columns) and caches the raw cells per quest so `QuestPageParser` can build
 * the final `Quest` objects from the same already-fetched page.
 */
export class QuestListParser extends Parser<Record<string, string>[]> {
  /**
   * Cache of resolved quest rows, keyed by quest id.
   */
  static _rows: Record<string, RawQuestRow> = {};

  /**
   * Parses the HTML page and returns structured data.
   *
   * @returns {Promise<Record<string, string>[]>} A promise that resolves to the parsed data.
   */
  async parse(): Promise<Record<string, string>[]> {
    QuestListParser._rows = {};

    const result: Record<string, string>[] = [];
    const content = this._getFirst('#mw-content-text > .mw-parser-output');

    content.children('.mw-collapsible').each((_index: number, el: any): void => {
      const $el = this._page(el);
      const heading = $el.children('h2,h3,h4').first().text().trim();
      const type = SECTION_TYPES[heading];

      if (!type) {
        return;
      }

      this._extractTable(
        $el.find('table.wikitable').first(),
        heading,
        type,
        result,
      );
    });

    this._extractTable(
      content.children('.mw-collapsible-content').find('table.wikitable').first(),
      'Mission Quests',
      'mission',
      result,
    );

    return result;
  }

  /**
   * Resolves a wikitable's rows into a header list and a list of per-column
   * cell maps, carrying rowspan-shared cells forward into the rows they
   * cover.
   *
   * @param {Cheerio<any>} table The table to resolve.
   * @returns {{ headers: string[]; rows: Record<number, Cheerio<any> | null>[] }} The resolved headers and rows.
   */
  private _resolveRows(table: Cheerio<any>): { headers: string[]; rows: Record<number, Cheerio<any> | null>[] } {
    const trs = table.find('> tbody > tr');

    if (!table || table.length === 0 || trs.length === 0) {
      return { headers: [], rows: [] };
    }

    const headers: string[] = [];
    trs.eq(0).find('> th').each((_index: number, th: any): void => {
      headers.push(this._page(th).text().trim());
    });

    const pending: Record<number, { cell: Cheerio<any>; remaining: number }> = {};
    const rows: Record<number, Cheerio<any> | null>[] = [];

    for (let r = 1; r < trs.length; r += 1) {
      const tds = trs.eq(r).find('> td').toArray();
      let tdIndex = 0;
      const rowCells: Record<number, Cheerio<any> | null> = {};
      let c = 0;

      while (c < headers.length) {
        if (pending[c] && pending[c].remaining > 0) {
          rowCells[c] = pending[c].cell;
          pending[c].remaining -= 1;
          c += 1;
          continue;
        }

        const tdEl = tds[tdIndex];
        tdIndex += 1;

        if (!tdEl) {
          rowCells[c] = null;
          c += 1;
          continue;
        }

        const $td = this._page(tdEl);
        const rowspan = parseInt($td.attr('rowspan') || '1', 10);
        const colspan = parseInt($td.attr('colspan') || '1', 10);

        // A colspan cell fills multiple header columns with the same cell
        // reference (e.g. a merged Source + Requirements to Receive cell).
        for (let span = 0; span < colspan && c < headers.length; span += 1) {
          rowCells[c] = $td;

          if (rowspan > 1) {
            pending[c] = { cell: $td, remaining: rowspan - 1 };
          }

          c += 1;
        }
      }

      rows.push(rowCells);
    }

    return { headers, rows };
  }

  /**
   * Extracts every quest row from a section's table, caches the resolved
   * cells on `QuestListParser._rows`, and pushes a lightweight identifying
   * record (id/name/type/section) onto `result`.
   *
   * @param {Cheerio<any>} table The section's quest table.
   * @param {string} section The section's heading text.
   * @param {QuestType} type The wiki's categorization for quests in this section.
   * @param {Record<string, string>[]} result The accumulator to push identifying records onto.
   */
  private _extractTable(
    table: Cheerio<any>,
    section: string,
    type: QuestType,
    result: Record<string, string>[],
  ): void {
    if (!table || table.length === 0) {
      return;
    }

    const { headers, rows } = this._resolveRows(table);
    const nameCol = headers.indexOf('Name');

    if (nameCol === -1) {
      return;
    }

    rows.forEach((row: Record<number, Cheerio<any> | null>): void => {
      const nameCell = row[nameCol];
      const name = nameCell ? nameCell.text().trim() : '';

      if (!name) {
        return;
      }

      const baseId = toId(name);
      let id = baseId;
      let suffix = 1;

      while (QuestListParser._rows[id]) {
        suffix += 1;
        id = `${baseId}-${suffix}`;
      }

      const cells: Record<string, Cheerio<any> | null> = {};
      headers.forEach((header: string, colIndex: number): void => {
        cells[header] = row[colIndex] || null;
      });

      const anchorId = nameCell ? nameCell.attr('id') : undefined;
      const anchor = anchorId || section.replace(/\s+/g, '_').replace(/'/g, '%27');

      QuestListParser._rows[id] = {
        id,
        name,
        type,
        section,
        anchor,
        cells,
      };

      result.push({
        id,
        name,
        type,
        section,
      });
    });
  }

  /**
   * Looks up a previously resolved quest row by id.
   *
   * @param {string} id The quest id.
   * @returns {RawQuestRow | undefined} The resolved row, if found.
   */
  static getRow(id: string): RawQuestRow | undefined {
    return QuestListParser._rows[id];
  }
}
