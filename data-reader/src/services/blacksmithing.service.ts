// Local Imports
import { BlacksmithingParser } from '../parsers/blacksmithing.parser';
import { BLACKSMITHING_URL } from '../config';
import { fetchPage } from '../utils/scraper';

// Types
import { Blacksmithing } from '../models/blacksmithing';

/**
 * Service for managing Blacksmithing data.
 */
export class BlacksmithingService {
  /**
   * Fetches the Blacksmithing skill perks and recipes.
   *
   * @returns {Promise<Blacksmithing>} A promise that resolves to the Blacksmithing data.
   */
  async fetch(): Promise<Blacksmithing> {
    return this._getBlacksmithingPage();
  }

  /**
   * Fetches and parses the Blacksmithing page.
   *
   * @returns {Promise<Blacksmithing>} A promise that resolves to the Blacksmithing data.
   */
  async _getBlacksmithingPage(): Promise<Blacksmithing> {
    const page = await fetchPage(BLACKSMITHING_URL);

    const parser = new BlacksmithingParser(
      BLACKSMITHING_URL,
      page,
    );

    return parser.parse();
  }
}
