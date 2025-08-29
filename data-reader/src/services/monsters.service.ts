// Local Imports
import { MONSTERS_URL } from '../config';
import { fetchPage } from '../utils/scraper';

// Types
import { Monster } from '../models/monsters';

/**
 * Service for managing monster data.
 */
export class MonstersService {
  /**
   * Fetches monster data for all monsters.
   *
   * @returns {Promise<Monster[]>} A promise that resolves to an array of Monster objects.
   */
  async fetch(): Promise<Monster[]> {
    return [];
  }
}