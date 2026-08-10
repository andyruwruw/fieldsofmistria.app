// Local Imports
import { BASE_URL } from '../config';
import { Parser } from './parser';

/**
 * Parses the main equipment list page to extract equipment URLs.
 *
 * The equipment list is laid out as two collapsible tables ("Standard
 * Equipment" and "Special Equipment"), each row bundling a whole set
 * (e.g. helmet / chestpiece / pants / shoes / ring) together under a
 * single "Image" cell with one link per piece.
 */
export class EquipmentListParser extends Parser<Record<string, string>[]> {
  /**
   * Parses the HTML page and returns structured data.
   *
   * @returns {Promise<Record<string, string>[]>} A promise that resolves to the parsed data.
   */
  async parse(): Promise<Record<string, string>[]> {
    const tables = this._get('table.wikitable.mw-collapsible.sortable');
    const equipment = [] as Record<string, string>[];
    const seen = new Set<string>();

    tables.each((i: number, table: any) => {
      this._page(table).find('tbody > tr').each((j: number, row: any) => {
        const imageCell = this._page(row).find('td').eq(0);

        imageCell.find('a').each((k: number, link: any) => {
          const anchor = this._page(link);
          const href = anchor.attr('href');
          const name = anchor.attr('title') || anchor.text().trim();

          if (!href || !name || seen.has(href)) {
            return;
          }

          seen.add(href);

          equipment.push({
            id: name.toLowerCase().replace(/\s+/g, '-'),
            name,
            href: `${BASE_URL}${href}`,
          });
        });
      });
    });

    return equipment;
  }
}
