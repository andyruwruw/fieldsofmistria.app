// Local Imports
import { fetchPage } from '../utils/scraper';

// Types
import { MAGIC_SPELLS_URL } from '../config';
import { Spell } from '../models/spells';

/**
 * Service for managing spell data.
 */
export class SpellsService {
  /**
   * Fetches spell data for all spells.
   *
   * @returns {Promise<Spell[]>} A promise that resolves to an array of Spell objects.
   */
  async fetch(): Promise<Spell[]> {
    return [];
  }
}