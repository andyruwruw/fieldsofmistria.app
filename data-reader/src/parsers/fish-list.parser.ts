// Local Imports
import { BASE_URL } from '../config';
import { Parser } from './parser';

/**
 * Parses the fish page.
 */
export class FishListParser extends Parser<string[]> {
  /**
   * Parses the HTML page and returns structured data.
   *
   * @returns {Promise<string[]>} A promise that resolves to the parsed data.
   */
  async parse(): Promise<string[]> {
    const mainChildren = this._get('table.wikitable.sortable.mw-collapsible');

    const fishUrls = [];

    console.log(`0%   | Fetching Fish`);

    for (let i = 0; i < mainChildren.length; i += 1) {
      const child = mainChildren[i];

      const table = this._condenseTable(this._parseTable(child));

      if (!table) {
        continue;
      }

      const tableItems = this._parseFishTable(table);

      if (tableItems.length === 0 || tableItems.includes(`${BASE_URL}/wiki/Clay`)) {
        continue;
      }

      fishUrls.push(...tableItems);
    }

    return fishUrls;
  }

  /**
   * Parses a fish table for Urls.
   *
   * @param {Record<string, any> | undefined} table The table to parse.
   * @return {string[]} An array of fish URLs.
   */
  _parseFishTable(table: Record<string, any> | undefined): string[] {
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