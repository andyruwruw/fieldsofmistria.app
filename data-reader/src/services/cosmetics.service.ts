// Local Imports
import { normalizeStringLength } from '../utils/convert';
import { CosmeticPageParser } from '../parsers/cosmetic.parser';
import { CosmeticListParser } from '../parsers/cosmetic-list.parser';
import { COSMETICS_URL } from '../config';
import { fetchAll, fetchPage } from '../utils/scraper';

// Types
import { Cosmetic } from '../models/cosmetics';

/**
 * Service for managing cosmetic data.
 */
export class CosmeticsService {
  /**
   * Fetches cosmetic data for all cosmetics (accessories, clothes, hairstyles).
   *
   * @returns {Promise<Cosmetic[]>} A promise that resolves to an array of Cosmetic objects.
   */
  async fetch(): Promise<Cosmetic[]> {
    const categories = await this._getCategoryList();
    const categoryUrls = categories.map((category: Record<string, string>): string => (category.href));

    let last = 0;

    const results = await fetchAll(categoryUrls, async (url: string, index: number): Promise<Cosmetic[]> => {
      const percent = Math.floor((index / categoryUrls.length) * 10);
      if (percent > last) {
        last = percent;
        console.log(`${normalizeStringLength(`${percent * 10}%`, 4)} | Fetching Cosmetics`);
      }

      return this._getCosmeticsForCategory(url);
    });

    console.log(`100% | Done Fetching Cosmetics`);

    return results.flat();
  }

  /**
   * Fetches the list of cosmetic category page URLs.
   *
   * @returns {Promise<Record<string, string>[]>} A promise that resolves to an array of category refs.
   */
  async _getCategoryList(): Promise<Record<string, string>[]> {
    const page = await fetchPage(COSMETICS_URL);

    const parser = new CosmeticListParser(
      COSMETICS_URL,
      page,
    );

    return parser.parse();
  }

  /**
   * Fetches and parses every cosmetic on a single category page.
   *
   * @param {string} url The category page URL.
   * @returns {Promise<Cosmetic[]>} A promise that resolves to the cosmetics found on that page.
   */
  async _getCosmeticsForCategory(url: string): Promise<Cosmetic[]> {
    const page = await fetchPage(url);

    const parser = new CosmeticPageParser(
      url,
      page,
    );

    return parser.parse();
  }
}
