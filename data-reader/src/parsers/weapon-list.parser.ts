// Local Imports
import { BASE_URL } from '../config';
import { Parser } from './parser';

/**
 * Parses the main weapons list page to extract weapon URLs.
 */
export class WeaponListParser extends Parser<Record<string, string>[]> {
  /**
   * Parses the HTML page and returns structured data.
   *
   * @returns {Promise<Record<string, string>[]>} A promise that resolves to the parsed data.
   */
  async parse(): Promise<Record<string, string>[]> {
    const table = this._getFirst('table.wikitable.sortable');
    const weapons = [] as Record<string, string>[];

    if (!table || table.length === 0) {
      return weapons;
    }

    table.find('tbody > tr').each((i: number, row: any) => {
      const nameCell = this._page(row).find('td').eq(1);
      const link = nameCell.find('a').first();
      const href = link.attr('href');
      const name = link.text().trim();

      if (!href || !name) {
        return;
      }

      weapons.push({
        id: name.toLowerCase().replace(/\s+/g, '-'),
        name,
        href: `${BASE_URL}${href}`,
      });
    });

    return weapons;
  }
}
