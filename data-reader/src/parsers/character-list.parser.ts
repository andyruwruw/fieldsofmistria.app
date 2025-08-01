// Local Imports
import { BASE_URL } from '../config';
import { Parser } from './parser';

/**
 * Parses the main character list page to extract character URLs.
 */
export class CharacterListParser extends Parser<string[]> {
  /**
   * Parse character icons.
   */
  static icons = {} as Record<string, string>;

  /**
  /**
   * Parses the HTML page and returns structured data.
   *
   * @returns {Promise<string[]>} A promise that resolves to the parsed data.
   */
  async parse(): Promise<string[]> {
    const characterLink = this._page('div.chara-box div.bubble a');

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

      const name = url.split('/').pop()?.replace('.html', '') || '';
      const children = link.children;

      if (children && children.length > 0 && children[0].type === 'tag' && children[0].name === 'img') {
        const icon = children[0].attribs?.src;

        if (icon) {
          CharacterListParser.icons[name.toLowerCase().replace(/\s+/g, '-')] = `${BASE_URL}${icon}`;
        }
      }

      list[url] = true;
    }

    return Object.keys(list);
  }

  /**
   * Gets the icon for a character.
   *
   * @param {string} id - The ID of the character.
   * @returns {string} The icon URL.
   */
  static getIcon(id: string): string {
    return CharacterListParser.icons[id.toLowerCase().replace(/\s+/g, '-')] || '';
  }
}
