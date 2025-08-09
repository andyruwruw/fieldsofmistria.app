// Local Imports
import { fetchPage } from '../utils/scraper';

// Types
import { QUESTS_URL } from '../config';
import { Quest } from '../models/quests';

/**
 * Service for managing quest data.
 */
export class QuestsService {
  /**
   * Fetches quest data for all quests.
   *
   * @returns {Promise<Quest[]>} A promise that resolves to an array of Quest objects.
   */
  async fetch(): Promise<Quest[]> {
    return [];
  }
}
