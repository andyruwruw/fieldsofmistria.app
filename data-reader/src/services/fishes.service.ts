// Local Imports
import { FishListParser } from '../parsers/fish-list.parser';
import { fetchPage } from '../utils/scraper';
import { FISH_URL } from '../config';

// Types
import { Fish } from '../models/fish';
import { normalizeStringLength } from '../utils/convert';
import wait from '../utils/wait';
import { FishPageParser } from '../parsers/fish.parser';

/**
 * Service for managing fish data.
 */
export class FishesService {
  /**
   * Fetches fish data for all fish.
   *
   * @returns {Promise<Fish[]>} A promise that resolves to an array of Fish objects.
   */
  async fetch(): Promise<Fish[]> {
    const fishUrls = await this._getFishList();

    const fishPromises = [];
    let last = 0;

    // for (let i = 0; i < 2; i += 1) {
    for (let i = 0; i < fishUrls.length; i += 1) {
      const url = fishUrls[i];

      const percent = Math.floor((i / fishUrls.length) * 10);
      if (percent > last) {
        last = percent;
        console.log(`${normalizeStringLength(`${percent * 10}%`, 4)} | Fetching Fish`);
      }

      await wait(100);

      // Fetch each fish's data
      // fishPromises.push(this._getFish('https://fieldsofmistria.wiki.gg/wiki/Adeline'));
      fishPromises.push(this._getFish(url));
    }

    const result = await Promise.all(fishPromises);

    console.log(`100% | Done Fetching Fish`);

    return result;
  }

  /**
   * Fetches the list of fish URLs from the fish list page.
   *
   * @returns {Promise<string[]>} A promise that resolves to an array of fish URLs.
   */
  async _getFishList(): Promise<string[]> {
    const page = await fetchPage(FISH_URL);

    // Assuming a FishListParser exists similar to CharacterListParser
    const parser = new FishListParser(FISH_URL, page);

    return parser.parse();
  }

  /**
   * Fetches data for a specific fish.
   *
   * @param {string} url - The URL of the fish page.
   * @returns {Promise<Fish>} A promise that resolves to a Fish object.
   */
  async _getFish(url: string): Promise<Fish> {
    const page = await fetchPage(url);

    // Assuming a FishPageParser exists similar to CharacterPageParser
    const parser = new FishPageParser(url, page);

    return parser.parse();
  }
}