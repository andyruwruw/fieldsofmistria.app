// Local Imports
import { BASE_URL } from '../config';
import { Parser } from './parser';

/**
 * Parses the main festivals page to extract festivals.
 */
export class FestivalsParser extends Parser<string[]> {
  /**
   * Parses the HTML page and returns structured data.
   *
   * @returns {Promise<string[]>} A promise that resolves to the parsed data.
   */
  async parse(): Promise<string[]> {
    const mainChildren = this._get('div.mw-body-content table');

    const festivals: string[] = [];

    const data = this._condenseTable(this._parseTable(mainChildren[0]));

    if (!data) {
      return festivals;
    }

    for (const item in data.body) {
      for (const key in data.body[item]) {
        if (parseInt(key) !== undefined && 'href' in data.body[item][key]) {
          festivals.push(`${BASE_URL}${data.body[item][key].href instanceof Array ? data.body[item][key].href[0] : data.body[item][key].href}`);
        }
      }
    }

    return festivals;
  }
}
