// Local Imports
import { BASE_URL } from '../config';
import { Parser } from './parser';

/**
 * Parses the `Category:Location` page to extract every location's name and
 * URL.
 *
 * Unlike most category pages on this wiki, `LOCATIONS_URL` points at a
 * standard MediaWiki category-listing page rather than a wiki content page
 * with a navigation table, so `_parseNavigationTable()`/
 * `_parseHorizontalTable()` don't apply here. The markup is the generic
 * MediaWiki `Category:` format:
 *
 * ```html
 * <div id="mw-pages">
 *   <div class="mw-category mw-category-columns">
 *     <div class="mw-category-group"><h3>A</h3>
 *       <ul><li><a href="/wiki/Aldaria" title="Aldaria">Aldaria</a></li>...</ul>
 *     </div>
 *     ...one .mw-category-group per starting letter...
 *   </div>
 * </div>
 * ```
 *
 * Any other category (a URL of the form `.../wiki/Category:X`) can reuse
 * this same `#mw-pages .mw-category-group li a` selector.
 */
export class LocationListParser extends Parser<Record<string, string>[]> {
  /**
   * Parses the HTML page and returns structured data.
   *
   * @returns {Promise<Record<string, string>[]>} A promise that resolves to a list of `{ id, name, href }` entries, one per location page.
   */
  async parse(): Promise<Record<string, string>[]> {
    const locations: Record<string, string>[] = [];

    this._get('#mw-pages .mw-category-group li a').each((_index: number, el: any): void => {
      const anchor = this._page(el);
      const name = anchor.text().trim();
      const href = anchor.attr('href');

      if (!name || !href) {
        return;
      }

      locations.push({
        id: name.toLowerCase().replace(/\s+/g, '-').trim(),
        name,
        href: `${BASE_URL}${href}`,
      });
    });

    return locations;
  }
}
