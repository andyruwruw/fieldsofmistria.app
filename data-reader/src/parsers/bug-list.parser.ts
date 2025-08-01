// Local Imports
import { normalizeStringLength } from '../utils/convert';
import { BASE_URL } from '../config';
import { Parser } from './parser';

// Types
import { Bug } from '../models/bugs';

/**
 * Parses the bugs page.
 */
export class BugsListParser extends Parser<Bug[]> {
  /**
   * Parses the HTML page and returns structured data.
   *
   * @returns {Promise<Bug[]>} A promise that resolves to the parsed data.
   */
  async parse(): Promise<Bug[]> {
    const mainChildren = this._getChildren('div.mw-content-ltr');

    const table = this._condenseTable(this._parseTable(this._firstTagAfterTag(
      'table',
      'h2',
      mainChildren,
      [ 'Bugs' ],
    )));

    return this._parseBugTable(table);
  }

  /**
   * Parses a bug table and extracts the bugs.
   *
   * @param {Record<string, any> | undefined} table The table to parse.
   * @return {Bug[]} An array of bugs.
   */
  _parseBugTable(table: Record<string, any> | undefined): Bug[] {
    if (!table) {
      return [];
    }

    const bugs = [] as Bug[];

    const body = table.body.filter((row: Record<string, any>) => (Object.keys(row).length > 0));
    let last = 0;

    for (let i = 0; i < body.length; i += 1) {
      const row = body[i];

      const name = row.Name.text.trim();

      const percent = Math.floor((i / body.length) * 10);
      if (percent > last) {
        last = percent;
        console.log(`${normalizeStringLength(`${percent * 10}%`, 4)} | Fetching Bugs`);
      }

      const REGEX_PARSE_TIME = /(\d{1,2})(AM|PM)[\s-]+(\d{1,2})(AM|PM)/;
      const time = row.Time ? row.Time.text.trim() : '';

      let start = 0;
      let end = 0;

      if (REGEX_PARSE_TIME.test(time)) {
        const matches = time.match(REGEX_PARSE_TIME);

        if (matches && matches.length === 4) {
          start = parseInt(matches[1], 10) + (matches[2] === 'PM' ? 12 : 0);
          end = parseInt(matches[3], 10) + (matches[4] === 'PM' ? 12 : 0);
        }
      }

      bugs.push({
        id: name.toLowerCase().replace(/\s+/g, '-'),
        name: name,
        description: row.Description.text.trim(),
        sell: row.Price || row.Price.text ? parseInt(row.Price.text.replace(/[^0-9]/g, ''), 10) : 0,
        location: row.Location && row.Location.text ? row.Location.text instanceof Array ? row.Location.text.join(' ').toLowerCase().replace(/\s+/g, '-') : row.Location.text.toLowerCase().replace(/\s+/g, '-') : '',
        'spawn-condition': row['Spawn Condition'] && row['Spawn Condition'].text ? row['Spawn Condition'].text.trim() : '',
        seasons: row.Season.text.map((season: string) => season.trim().toLowerCase().replace(/\s+/g, '-')),
        weather: row.Weather.text instanceof Array ? row.Weather.text.map((weather: string) => weather.trim().toLowerCase().replace(/\s+/g, '-')) : [row.Weather.text.trim().toLowerCase().replace(/\s+/g, '-')],
        'time-start': start,
        'time-end': end,
        rarity: row.Rarity && row.Rarity.text ? row.Rarity.text.trim().toLowerCase().replace(/\s+/g, '-') : '',
        image: row.Image && row.Image.src ? `${BASE_URL}${row.Image.src.trim()}` : '',
        href: row.Name.href ? `${BASE_URL}${row.Name.href}` : '',
      });
    }

    console.log(`100% | Done Fetching Bugs`);

    return bugs;
  }
}
