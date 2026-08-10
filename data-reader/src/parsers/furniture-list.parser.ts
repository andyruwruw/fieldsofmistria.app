// Packages
import { CheerioAPI } from 'cheerio';

// Local Imports
import { Parser } from './parser';
import { BASE_URL } from '../config';

/**
 * Parses a furniture category page (e.g. `/wiki/Furniture/Categories/Seating`) to
 * extract the individual furniture item pages listed in its tables. Also usable
 * against the main Furniture page, since it shares the same table markup for its
 * "Other" section.
 */
export class FurnitureListParser extends Parser<Record<string, string>[]> {
  /**
   * Parses the HTML page and returns structured data.
   *
   * @returns {Promise<Record<string, string>[]>} A promise that resolves to the parsed data.
   */
  async parse(): Promise<Record<string, string>[]> {
    const items = [] as Record<string, string>[];
    const seen = new Set<string>();

    this._get('table.wikitable.mw-collapsible td').each((_i: number, td: any) => {
      const cell = this._page(td);

      // Skip the Image / Source columns, which always contain an image; only
      // the Name column is a plain text link straight to the item's page.
      if (cell.find('img').length > 0) {
        return;
      }

      const link = cell.find('a').first();
      const href = link.attr('href');

      if (!href
        || !href.startsWith('/wiki/')
        || href.includes(':')
        || href.includes('?')
        || href.includes('#')) {
        return;
      }

      if (seen.has(href)) {
        return;
      }

      seen.add(href);

      const name = decodeURIComponent(href.replace('/wiki/', '')).replace(/_/g, ' ');

      items.push({
        id: name.toLowerCase().replace(/\s+/g, '-').trim(),
        name,
        href: `${BASE_URL}${href}`,
      });
    });

    return items;
  }

  /**
   * Parses the main Furniture page to extract the URLs of the furniture category
   * pages (e.g. Seating, Lighting, Flooring), which together enumerate every
   * furniture item in the game.
   *
   * @param {CheerioAPI} page The Cheerio instance representing the main Furniture page.
   * @returns {string[]} The URLs of the furniture category pages.
   */
  static getCategoryUrls(page: CheerioAPI): string[] {
    const hrefs = new Set<string>();

    page('div.mw-parser-output')
      .first()
      .children('h2')
      .each((_i: number, heading: any) => {
        if (page(heading).text().trim() !== 'Furniture Categories') {
          return;
        }

        let sibling = heading.next;

        while (sibling) {
          if (sibling.type === 'tag' && sibling.name === 'ul') {
            page(sibling).find('a').each((_j: number, a: any) => {
              const href = page(a).attr('href');

              if (href) {
                hrefs.add(`${BASE_URL}${href}`);
              }
            });

            break;
          }

          if (sibling.type === 'tag' && (sibling.name === 'h2' || sibling.name === 'h3')) {
            break;
          }

          sibling = sibling.next;
        }
      });

    return Array.from(hrefs);
  }
}
