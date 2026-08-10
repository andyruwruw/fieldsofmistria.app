// Local Imports
import { BASE_URL } from '../config';
import { Parser } from './parser';

/**
 * Parses the main Cosmetics page to extract the category page URLs
 * (Accessories, Clothes, Hairstyles). The wiki has no per-item cosmetic
 * pages, so each of these category pages is fetched and parsed in full by
 * `CosmeticPageParser`.
 */
export class CosmeticListParser extends Parser<Record<string, string>[]> {
  /**
   * Parses the HTML page and returns structured data.
   *
   * @returns {Promise<Record<string, string>[]>} A promise that resolves to the parsed data.
   */
  async parse(): Promise<Record<string, string>[]> {
    const gallery = this._getFirst('ul.gallery.mw-gallery-packed');
    const categories: Record<string, string>[] = [];

    gallery.find('li.gallerybox').each((_index: number, element: any) => {
      const link = this._page(element).find('.gallerytext a').first();
      const name = link.text().trim();
      const href = link.attr('href');

      if (!name || !href) {
        return;
      }

      categories.push({
        id: name.toLowerCase().replace(/\s+/g, '-').trim(),
        name,
        href: `${BASE_URL}${href}`,
      });
    });

    return categories;
  }
}
