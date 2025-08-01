// Local Imports
import { fetchPage } from '../utils/scraper';

// Types
import { FISH_URL } from '../config';
import { Fish } from '../models/fish';

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
    return [];
  }
}