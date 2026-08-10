// Local Imports
import { convertTesseraeString } from '../utils/convert';
import { BASE_URL } from '../config';
import { Parser } from './parser';

// Types
import { AnimalCosmetic } from '../models/ranching';

/**
 * Parses the Animal Cosmetics page, which lists every cosmetic directly in
 * a table per animal type (plus a "Pet" table), with no other content in
 * between an `<h3>` heading and its `<table>`.
 *
 * Individual cosmetic pages exist (e.g. `Alpaca_Beaded_Necklace`), but
 * their infobox description is the same boilerplate line
 * ("Use this item to unlock the cosmetic to for your animals to wear!")
 * repeated verbatim on every cosmetic page, and every other field
 * (image, source) is already present in this table. So there is no
 * separate detail parser; everything is extracted from this list page.
 */
export class AnimalCosmeticListParser extends Parser<AnimalCosmetic[]> {
  /**
   * Parses the HTML page and returns structured data.
   *
   * @returns {Promise<AnimalCosmetic[]>} A promise that resolves to the parsed data.
   */
  async parse(): Promise<AnimalCosmetic[]> {
    const cosmetics: AnimalCosmetic[] = [];
    const mainChildren = this._getChildren('div.mw-content-ltr');

    let type = '';

    for (let i = 0; i < mainChildren.length; i += 1) {
      const child = mainChildren[i];

      if (child.type !== 'tag') {
        continue;
      }

      if (child.name === 'h3') {
        type = this._page(child).text().trim().toLowerCase().replace(/s$/, '');
      } else if (child.name === 'table'
        && this._page(child).hasClass('wikitable')
        && type) {
        cosmetics.push(...this._parseTypeTable(
          this._page(child),
          type,
        ));
      }
    }

    return cosmetics;
  }

  /**
   * Parses a single animal-type table (e.g. Alpacas, Pet) into cosmetics.
   *
   * @param {any} table The Cheerio instance representing the table.
   * @param {string} type The animal (or "pet") type this table represents.
   * @returns {AnimalCosmetic[]} The parsed cosmetics.
   */
  _parseTypeTable(
    table: any,
    type: string,
  ): AnimalCosmetic[] {
    const cosmetics: AnimalCosmetic[] = [];
    const rows = table.find('tbody tr').slice(1);

    let petAppearance = '';

    for (let i = 0; i < rows.length; i += 1) {
      const row = this._page(rows[i]);
      const cells = row.find('td');

      if (cells.length === 0) {
        continue;
      }

      const image = cells.eq(0).find('img').attr('src') || '';
      const nameLink = cells.eq(1).find('a').first();
      const name = nameLink.text().trim();
      const href = nameLink.attr('href') || '';

      let sourceCell;

      if (type === 'pet') {
        if (cells.length === 4) {
          petAppearance = cells.eq(2).text().trim();
        }

        sourceCell = cells.eq(cells.length === 4 ? 3 : 2);
      } else {
        sourceCell = cells.eq(2);
      }

      const source = sourceCell.text().replace(/\s+/g, ' ').trim();

      cosmetics.push({
        id: name.toLowerCase().replace(/\s+/g, '-').trim(),
        name,
        description: '',
        image: image ? `${BASE_URL}${image}` : '',
        type,
        'pet-appearance': type === 'pet' ? petAppearance : '',
        buy: convertTesseraeString(source),
        source,
        href: href ? `${BASE_URL}${href}` : '',
      });
    }

    return cosmetics;
  }
}
