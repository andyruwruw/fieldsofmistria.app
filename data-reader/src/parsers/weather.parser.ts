// Local Imports
import { BASE_URL } from '../config';
import { Parser } from './parser';

// Types
import { Weather } from '../models/weather';

/**
 * Parses the main weather page to extract weather data.
 */
export class WeatherParser extends Parser<Weather[]> {
  /**
   * Parses the HTML page and returns structured data.
   *
   * @returns {Promise<Weather[]>} A promise that resolves to the parsed data.
   */
  async parse(): Promise<Weather[]> {
    const mainChildren = this._get('div.mw-body-content table');

    const weathers: Weather[] = [];

    const data = this._condenseTable(this._parseTable(mainChildren[0]));

    if (!data) {
      return weathers;
    }

    for (let row of data.body) {
      const name = row.Weather.text.trim();

      const keys = name.split('/');

      for (let key of keys) {
        const weather: Weather = {
          id: key.trim().toLowerCase().replace(/[\s\.']+/g, '-'),
          name: key.trim(),
          description: this._parseDescription(row.Description.text),
          image: `${BASE_URL}${row.Image.src}` || '',
        };

        weathers.push(weather);
      }
    }

    return weathers;
  }

  /**
   * Parses the description text.
   *
   * @param text The description text to parse.
   * @returns The parsed description.
   */
  protected _parseDescription(text: string | string[]): string {
    if (!(text instanceof Array)) {
      return text;
    }

    return text.join(' ')
      .replace(' .', '.')
      .replace('Blizzard s', 'Blizzards')
      .replace('torm s', 'torms');
  }
}
