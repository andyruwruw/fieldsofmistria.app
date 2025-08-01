// Local Imports
import { fetchPage } from '../utils/scraper';

// Types
import { COOKING_URL } from '../config';
import { Dish } from '../models/dishes';

/**
 * Service for managing dish data.
 */
export class DishesService {
  /**
   * Fetches dish data for all dishes.
   *
   * @returns {Promise<Dish[]>} A promise that resolves to an array of Dish objects.
   */
  async fetch(): Promise<Dish[]> {
    return [];
  }
}