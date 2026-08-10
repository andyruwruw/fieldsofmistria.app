// Local Imports
import { BASE_URL } from '../config';
import { Parser } from './parser';

/**
 * Parses the main festivals page to extract festival URLs.
 *
 * The "Annual Festivals" table has no `<thead>` (its header rows live
 * inside `<tbody>` alongside the data) and merges the Season column with
 * `rowspan`, so the generic `_condenseTable` helper can't read it: every
 * row's last `<td>` is always the festival name/link regardless of whether
 * that row also carries the rowspanned Season cell.
 */
export class FestivalsParser extends Parser<string[]> {
  /**
   * Parses the HTML page and returns structured data.
   *
   * @returns {Promise<string[]>} A promise that resolves to the parsed data.
   */
  async parse(): Promise<string[]> {
    const table = this._getFirst('div.mw-body-content table.wikitable');
    const festivals: string[] = [];

    table.find('tr').each((_index: number, row: any): void => {
      const cells = this._page(row).find('td');

      if (cells.length === 0) {
        return; // Header rows have no <td>.
      }

      const href = cells.last().find('a').first().attr('href');

      if (href) {
        festivals.push(`${BASE_URL}${href}`);
      }
    });

    return festivals;
  }
}
