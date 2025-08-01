// Local Imports
import { BASE_URL } from '../config';
import { Parser } from './parser';

/**
 * Parses the forageable items page.
 */
export class ForageableListParser extends Parser<string[]> {
  /**
   * Parses the HTML page and returns structured data.
   *
   * @returns {Promise<string[]>} A promise that resolves to the parsed data.
   */
  async parse(): Promise<string[]> {
    const mainChildren = this._getChildren('div.mw-content-ltr');

    console.log(`0%   | Fetching Forageables`);

    const mainTable = this._condenseTable(this._parseTable(this._firstTagAfterTag(
      'table',
      'p',
      mainChildren,
      [],
    )));

    const forageableUrls = this._parseForageableTable(mainTable) || [];

    return forageableUrls;
  }

  /**
   * Parses a forageable table for Urls.
   *
   * @param {Record<string, any> | undefined} table The table to parse.
   * @return {string[]} An array of forageable URLs.
   */
  _parseForageableTable(table: Record<string, any> | undefined): string[] {
    if (!table) {
      return [];
    }

    const urls = [];

    const body = table.body.filter((row: Record<string, any>) => (Object.keys(row).length > 0));

    for (let i = 0; i < body.length; i += 1) {
      const row = body[i];
      urls.push(`${BASE_URL}${row.Name.href.trim()}`);
    }

    return urls;
  }
}