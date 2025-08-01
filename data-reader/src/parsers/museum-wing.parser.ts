// Local Imports
import { Parser } from './parser';

// Types
import { MuseumSet } from '../models/museum';
import { Season } from '../models/weather';

/**
 * Parses a specific museum wing page.
 */
export class MuseumWingParser extends Parser<MuseumSet[]> {
  /**
   * Parses the HTML page and returns structured data.
   *
   * @returns {Promise<MuseumSet[]>} A promise that resolves to the parsed data.
   */
  async parse(): Promise<MuseumSet[]> {
    const title = await ((await this._getChildren('h1#firstHeading') as Record<string, any>))[0].children[0].data;
    const mainChildren = this._getChildren('div.mw-content-ltr');

    const sets = [] as MuseumSet[];
    let setTitle = '';

    for (let i = 0; i < mainChildren.length; i += 1) {
      const child = mainChildren[i];

      if (child.type === 'tag' && child.name === 'h2') {
        const data = this._parseValue(child) as Record<string, string>;
        setTitle = data.text;
      }

      if (child.type === 'tag'
        && child.name === 'table'
        && setTitle !== '') {
        const table = this._condenseTable(this._parseTable(child));

        if (!table) {
          continue;
        }

        const tableItems = this._parseSetTable(table);
        const legendary = setTitle.toLowerCase().includes('legendary');
        let season = 'all' as Season;

        if (setTitle.toLowerCase().includes('spring')) {
          season = 'spring' as Season;
        } else if (setTitle.toLowerCase().includes('summer')) {
          season = 'summer' as Season;
        } else if (setTitle.toLowerCase().includes('fall')) {
          season = 'fall' as Season;
        } else if (setTitle.toLowerCase().includes('winter')) {
          season = 'winter' as Season;
        }

        sets.push({
          id: setTitle.toLowerCase().replace(/\s+/g, '-'),
          name: setTitle,
          items: tableItems,
          wing: title.toLowerCase().replace(/\s+/g, '-'),
          season,
          legendary,
        });
        setTitle = '';
      }
    }

    return sets;
  }

  /**
   * Parses a table for items in a museum set.
   *
   * @param {Record<string, any>} table - The table to parse.
   * @returns {string[]} An array of parsed item names.
   */
  _parseSetTable(table: Record<string, any>): string[] {
    const items = [] as string[];

    for (let i = 0; i < table.body.length; i += 1) {
      const row = table.body[i];

      if ('Name' in row && 'text' in row.Name) {
        items.push(row.Name.text.trim().toLowerCase().replace(/\s+/g, '-'));
      }
    }

    return items;
  }
}