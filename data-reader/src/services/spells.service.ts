// Local Imports
import { MAGIC_SPELLS_URL } from '../config';
import { SpellsParser } from '../parsers/spells.parser';
import { fetchPage } from '../utils/scraper';

// Types
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
    return this._getSpellsPage();
  }

  /**
   * Fetches data for all spells.
   *
   * @returns {Promise<Spell[]>} A promise that resolves to an array of Spell objects.
   */
  async _getSpellsPage(): Promise<Spell[]> {
    const page = await fetchPage(MAGIC_SPELLS_URL);

    const parser = new SpellsParser(
      MAGIC_SPELLS_URL,
      page,
    );

    return parser.parse();
  }
}