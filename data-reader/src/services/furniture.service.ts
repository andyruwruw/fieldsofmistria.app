// Local Imports
import { normalizeStringLength } from '../utils/convert';
import { FurniturePageParser } from '../parsers/furniture.parser';
import { FurnitureListParser } from '../parsers/furniture-list.parser';
import { FURNITURE_URL } from '../config';
import { fetchAll, fetchPage } from '../utils/scraper';

// Types
import { Furniture } from '../models/furniture';

/**
 * Service for managing furniture data.
 *
 * Furniture has no single list page: the main Furniture page only links out to
 * 15 category pages (Seating, Lighting, Flooring, etc.), which together
 * enumerate every furniture item via their own tables. So fetching works in
 * three stages: find the category URLs, crawl each category page for its item
 * URLs, then fetch each item's own page for its full details.
 */
export class FurnitureService {
  /**
   * Fetches furniture data for all furniture items.
   *
   * @returns {Promise<Furniture[]>} A promise that resolves to an array of Furniture objects.
   */
  async fetch(): Promise<Furniture[]> {
    const categoryUrls = await this._getCategoryUrls();

    const itemLists = await fetchAll(
      categoryUrls,
      (url: string): Promise<Record<string, string>[]> => (this._getCategoryItems(url)),
    );

    const items = this._dedupeItems(itemLists);

    console.log(`Found ${items.length} furniture items across ${categoryUrls.length} categories`);

    const itemUrls = items.map((item: Record<string, string>): string => (item.href));

    let last = 0;

    const result = await fetchAll(itemUrls, async (url: string, i: number): Promise<Furniture> => {
      const percent = Math.floor((i / itemUrls.length) * 10);

      if (percent > last) {
        last = percent;
        console.log(`${normalizeStringLength(`${percent * 10}%`, 4)} | Fetching Furniture`);
      }

      return this._getFurniturePage(url);
    });

    console.log('100% | Done Fetching Furniture');

    return result;
  }

  /**
   * Fetches the main Furniture page and extracts the furniture category URLs.
   *
   * @returns {Promise<string[]>} A promise that resolves to an array of category URLs.
   */
  async _getCategoryUrls(): Promise<string[]> {
    const page = await fetchPage(FURNITURE_URL);

    return FurnitureListParser.getCategoryUrls(page);
  }

  /**
   * Fetches a furniture category page and extracts its item URLs.
   *
   * @param {string} url The category page's URL.
   * @returns {Promise<Record<string, string>[]>} A promise that resolves to an array of item entries.
   */
  async _getCategoryItems(url: string): Promise<Record<string, string>[]> {
    const page = await fetchPage(url);

    const parser = new FurnitureListParser(
      url,
      page,
    );

    return parser.parse();
  }

  /**
   * Deduplicates item entries gathered across every category page, since a
   * handful of items are cross-listed.
   *
   * @param {Record<string, string>[][]} itemLists The per-category item lists.
   * @returns {Record<string, string>[]} The deduplicated item entries.
   */
  _dedupeItems(itemLists: Record<string, string>[][]): Record<string, string>[] {
    const seen = new Set<string>();
    const items = [] as Record<string, string>[];

    for (let i = 0; i < itemLists.length; i += 1) {
      const list = itemLists[i];

      for (let j = 0; j < list.length; j += 1) {
        const item = list[j];

        if (seen.has(item.href)) {
          continue;
        }

        seen.add(item.href);
        items.push(item);
      }
    }

    return items;
  }

  /**
   * Fetches data for a single furniture item.
   *
   * @param {string} url The furniture item's URL.
   * @returns {Promise<Furniture>} A promise that resolves to a Furniture object.
   */
  async _getFurniturePage(url: string): Promise<Furniture> {
    const page = await fetchPage(url);

    const parser = new FurniturePageParser(
      url,
      page,
    );

    return parser.parse();
  }
}
