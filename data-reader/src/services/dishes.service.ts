// Local Imports
import {
  convertArrayToObjectWithIds,
  normalizeStringLength,
} from '../utils/convert';
import { DishPageParser } from '../parsers/dish.parser';
import { DishListParser } from '../parsers/dish-list.parser';
import { COOKING_URL } from '../config';
import { fetchPage } from '../utils/scraper';
import wait from '../utils/wait';

// Types
import { Dish } from '../models/dishes';

/**
 * Service for managing dish data.
 */
export class DishesService {
  /**
   * Fetches dish data for all dishes.
   *
   * @returns {Promise<Record<string, any>>} A promise that resolves to an array of Dish objects.
   */
  async fetch(): Promise<Record<string, any>> {
    const dishUrls = await this._getDishList();

    const dishPromises = [];
    let last = 0;

    // const index = 30;

    // for (let i = index; i < index + 10; i += 1) {
    for (let i = 0; i < dishUrls.length; i += 1) {
      const url = dishUrls[i];

      const percent = Math.floor((i / dishUrls.length) * 10);
      if (percent > last) {
        last = percent;
        console.log(`${normalizeStringLength(`${percent * 10}%`, 4)} | Fetching Dishes`);
      }

      await wait(500);

      // Fetch each dish's data
      dishPromises.push(this._getDish(url));
    }

    const result = await Promise.all(dishPromises);

    console.log(`100% | Done Fetching Dishes`);

    return {
      categories: DishListParser.DishCategories,
      subCategories: DishListParser.DishSubCategories,
      dishes: convertArrayToObjectWithIds(result),
    };
  }

  /**
   * Fetches a list of dishes.
   *
   * @returns {Promise<Record<string, any>>} A promise that resolves to an array of dishes.
   */
  async _getDishList(): Promise<string[]> {
    const page = await fetchPage(COOKING_URL);

    const parser = new DishListParser(
      COOKING_URL,
      page,
    );

    return parser.parse();
  }

  /**
   * Fetches data for a specific dish.
   *
   * @param {string} url - The URL of the dish page.
   * @returns {Promise<Dish>} A promise that resolves to a Dish object.
   */
  async _getDish(url: string): Promise<Dish> {
    const page = await fetchPage(url);

    // Placeholder for parsing the dish data
    const parser = new DishPageParser(
      url,
      page,
    );

    return parser.parse();
  }
}