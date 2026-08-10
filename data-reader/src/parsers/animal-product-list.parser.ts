// Local Imports
import { convertTesseraeString } from '../utils/convert';
import { BASE_URL } from '../config';
import { Parser } from './parser';

// Types
import { Gender } from '../models/index';
import {
  AnimalProduct,
  AnimalProductCategory,
  AnimalProductQuality,
} from '../models/ranching';

/**
 * Maps the section headings on the Ranching (Items) page to a category.
 */
const CATEGORIES: Record<string, AnimalProductCategory> = {
  Eggs: 'egg',
  Milk: 'milk',
  'Animal Fibers': 'fiber',
  Other: 'other',
};

/**
 * Parses the Ranching (Items) page, which lists every animal product
 * (eggs, milk, fibers, etc.) directly in a handful of tables, one per
 * category. Each product's everyday and "Golden" quality tier is a
 * separate table row, with the "Dropped By" cell `rowspan`-ing across the
 * pair, so the two rows have to be re-paired while walking the table.
 *
 * There's an individual wiki page per quality tier (e.g. `Chicken_Egg`,
 * `Golden_Egg`), but its infobox only repeats the description, image and
 * sell price already present in this table, and the shared `_parseAside()`
 * helper strips out the one field it doesn't repeat (`Sources`). So all
 * animal product fields are extracted from this list page alone; there is
 * no separate detail parser.
 */
export class AnimalProductListParser extends Parser<AnimalProduct[]> {
  /**
   * Parses the HTML page and returns structured data.
   *
   * @returns {Promise<AnimalProduct[]>} A promise that resolves to the parsed data.
   */
  async parse(): Promise<AnimalProduct[]> {
    const products: AnimalProduct[] = [];

    const tables = this._get('.mw-content-ltr table.wikitable.mw-collapsible.sortable');

    for (let i = 0; i < tables.length; i += 1) {
      const table = this._page(tables[i]);
      const title = table.find('tr').eq(0).text().trim();
      const category = CATEGORIES[title];

      if (!category) {
        continue;
      }

      products.push(...this._parseCategoryTable(table, category));
    }

    return products;
  }

  /**
   * Parses a single category table (e.g. Eggs, Milk) into products.
   *
   * @param {any} table The Cheerio instance representing the table.
   * @param {AnimalProductCategory} category The category this table represents.
   * @returns {AnimalProduct[]} The parsed products.
   */
  _parseCategoryTable(
    table: any,
    category: AnimalProductCategory,
  ): AnimalProduct[] {
    const products: AnimalProduct[] = [];
    const rows = table.find('tbody tr').slice(2);

    let current: AnimalProduct | null = null;

    for (let i = 0; i < rows.length; i += 1) {
      const row = this._page(rows[i]);
      const cells = row.find('td');

      if (cells.length === 7) {
        const droppedBy = cells.eq(3);
        const spriteText = droppedBy.find('span.sprite-text').text().trim();
        const animalHref = droppedBy.find('a').last().attr('href') || '';

        current = {
          id: '',
          name: '',
          category,
          animalId: this._getAnimalId(animalHref),
          gender: this._getGender(spriteText),
          qualities: [],
          href: '',
        };

        this._addQuality(
          current,
          cells,
          0,
          'normal',
        );

        products.push(current);
      } else if (cells.length === 6 && current) {
        this._addQuality(
          current,
          cells,
          1,
          'gold',
        );
      }
    }

    return products;
  }

  /**
   * Adds a quality tier row to the given product, and fills in the
   * product-level id/name/href from its first (normal) quality tier.
   *
   * @param {AnimalProduct} product The product to add the quality tier to.
   * @param {any} cells The `<td>` cells of the row.
   * @param {number} offset Column offset; base rows have a leading "Dropped By" cell that golden rows lack.
   * @param {'normal' | 'gold'} tier The quality tier this row represents.
   */
  _addQuality(
    product: AnimalProduct,
    cells: any,
    offset: number,
    tier: 'normal' | 'gold',
  ): void {
    const image = cells.eq(0).find('img').attr('src') || '';
    const nameLink = cells.eq(1).find('a').first();
    const name = nameLink.text().trim();
    const href = nameLink.attr('href') || '';
    const description = cells.eq(2).text().replace(/\s+/g, ' ').trim();
    const minReqText = cells.eq(4 - offset).text();
    const sellText = cells.eq(5 - offset).text();

    const heartsMatch = minReqText.match(/(\d+)\+/);

    const quality: AnimalProductQuality = {
      id: name.toLowerCase().replace(/\s+/g, '-').trim(),
      name,
      tier,
      description,
      image: image ? `${BASE_URL}${image}` : '',
      sell: convertTesseraeString(sellText),
      'min-hearts': heartsMatch ? parseInt(heartsMatch[1], 10) : 0,
      href: href ? `${BASE_URL}${href}` : '',
    };

    product.qualities.push(quality);

    if (tier === 'normal') {
      product.id = quality.id;
      product.name = quality.name;
      product.href = quality.href;
    }
  }

  /**
   * Derives the cross-referenced animal id from a "Dropped By" link's href.
   *
   * @param {string} href The href of the "Dropped By" link.
   * @returns {string | undefined} The animal id, or undefined if this product isn't tied to a specific animal.
   */
  _getAnimalId(href: string): string | undefined {
    const slug = href.replace('/wiki/', '');

    if (!slug || slug === 'Animals') {
      return undefined;
    }

    return slug.toLowerCase().replace(/_/g, '-');
  }

  /**
   * Derives the producing animal's gender from the "Dropped By" text.
   *
   * @param {string} text The "Dropped By" cell's visible text (e.g. "Hens (Chicken)", "Roosters").
   * @returns {Gender} The producing animal's gender.
   */
  _getGender(text: string): Gender {
    if (/^hens?/i.test(text)) {
      return 'Female';
    }

    if (/^(roosters?|drakes?|bulls?)/i.test(text)) {
      return 'Male';
    }

    return 'Any';
  }
}
