// Local Imports
import { ArtifactsService } from '../services/artifacts.service';
import { BASE_URL } from '../config';
import { Parser } from './parser';

// Types
import { MuseumSet } from '../models/museum';
import { Season } from '../models/weather';

const SET_ID_MAPPING = {
  'buried': 'mine',
  'tide-cavern': 'tide-caverns',
  'dig-site': 'common-finds',
  'multi-season': 'multi-season-fish',
  'spring-crop': 'spring-crops',
  'summer-crop': 'summer-crops',
  'fall-crop': 'fall-crops',
  'winter-crop': 'winter-crops',
  'spring-flower': 'spring-flowers',
  'summer-flower': 'summer-flowers',
  'fall-flower': 'fall-flowers',
  'winter-flower': 'winter-flowers',

} as Record<string, string>;

/**
 * Parses a specific museum wing page.
 */
export class MuseumWingParser extends Parser<MuseumSet[]> {
  /**
   * Indicates whether to store artifacts.
   */
  protected _storeArtifacts = false;

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

    if (title.toLowerCase().replace(/\s+/g, '-').includes('archaeology')) {
      this._storeArtifacts = true;
    }

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

        let id = setTitle.toLowerCase().replace(/\s+/g, '-');

        if (id in SET_ID_MAPPING) {
          id = SET_ID_MAPPING[id];
        }

        sets.push({
          id,
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
        if (this._storeArtifacts) {
          ArtifactsService.addArtifact(`${BASE_URL}${row.Name.href}`);
        }
        items.push(row.Name.text.trim().toLowerCase().replace(/\s+/g, '-'));
      }
    }

    return items;
  }
}