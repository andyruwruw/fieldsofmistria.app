// Local Imports
import { BASE_URL } from '../config';
import { Parser } from './parser';

/**
 * Parses the main character list page to extract character URLs.
 */
export class CharacterListParser extends Parser<string[]> {
  /**
   * Parses the HTML page and returns structured data.
   *
   * @returns {Promise<string[]>} A promise that resolves to the parsed data.
   */
  async parse(): Promise<string[]> {
    const characterLink = this._page('div.chara-box p a');

    const list = {} as Record<string, boolean>;

    for (const link of characterLink) {
      if (!link.attribs || !link.attribs.href) {
        continue;
      }

      const url = `${BASE_URL}${link.attribs.href}`;

      if (url.indexOf('Unknown') !== -1) {
        continue;
      }

      if (list[url]) {
        continue;
      }

      list[url] = true;
    }

    return Object.keys(list);
  }
}
