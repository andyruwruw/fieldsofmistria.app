// Local Imports
import { BugsListParser } from '../parsers/bug-list.parser';
import { fetchPage } from '../utils/scraper';
import { BUGS_URL } from '../config';

// Types
import { Bug } from '../models/bugs';

/**
 * Service for managing bug data.
 */
export class BugsService {
  /**
   * Fetches bug data for all bugs.
   *
   * @returns {Promise<Bug[]>} A promise that resolves to an array of Bug objects.
   */
  async fetch(): Promise<Bug[]> {
    return this._getBugPage();
  }

  /**
   * Fetches data for all bugs.
   *
   * @returns {Promise<Bug[]>} A promise that resolves to an array of Bug objects.
   */
  async _getBugPage(): Promise<Bug[]> {
    const page = await fetchPage(BUGS_URL);

    const parser = new BugsListParser(
      BUGS_URL,
      page,
    );

    return parser.parse();
  }
}