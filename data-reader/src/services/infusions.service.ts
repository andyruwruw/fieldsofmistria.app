// Local Imports
import { InfusionListParser } from '../parsers/infusion-list.parser';
import { INFUSIONS_URL } from '../config';
import { fetchPage } from '../utils/scraper';

// Types
import { Infusion } from '../models/infusions';

/**
 * Service for managing infusion data. Unlike most categories, every
 * infusion lives on the single Infusion wiki page (there are no per-item
 * detail pages), so fetching is a one-shot page load + parse.
 */
export class InfusionsService {
  /**
   * Fetches infusion data for all infusions.
   *
   * @returns {Promise<Infusion[]>} A promise that resolves to an array of Infusion objects.
   */
  async fetch(): Promise<Infusion[]> {
    const page = await fetchPage(INFUSIONS_URL);

    const parser = new InfusionListParser(
      INFUSIONS_URL,
      page,
    );

    const infusions = await parser.parse();

    console.log(`100% | Done Fetching Infusions`);

    return infusions;
  }
}
