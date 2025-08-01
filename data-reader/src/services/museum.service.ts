// Local Imports
import { MuseumWingParser } from '../parsers/museum-wing.parser';
import { MuseumParser } from '../parsers/museum.parser';
import { MUSEUM_URL } from '../config';
import { fetchPage } from '../utils/scraper';

// Types
import {
  MuseumSet,
  MuseumWing,
} from '../models/museum';

/**
 * Service for managing museum data.
 */
export class MuseumService {
  /**
   * Fetches museum data for all exhibits.
   *
   * @returns {Promise<Record<string, (MuseumWing[] | Record<string, MuseumSet[]>)>>} A promise that resolves to an array of Museum objects.
   */
  async fetch(): Promise<Record<string, (MuseumWing[] | Record<string, MuseumSet[]>)>> {
    const museumWings = await this._getMuseumWings();
    const sets = {} as Record<string, MuseumSet[]>;

    for (let i = 0; i < museumWings.length; i += 1) {
      const wing = museumWings[i];

      sets[wing.id] = await this._getMuseumWing(wing.href);
    }

    return {
      wings: museumWings,
      sets,
    };
  }

  /**
   * Fetches a list of museum wing URLs.
   *
   * @returns {Promise<MuseumWing[]>} A promise that resolves to an array of museum wing URLs.
   */
  async _getMuseumWings(): Promise<MuseumWing[]> {
    const page = await fetchPage(MUSEUM_URL);

    const parser = new MuseumParser(
      MUSEUM_URL,
      page,
    );

    return parser.parse();
  }

  /**
   * Fetches data for all sets in a museum wing.
   *
   * @returns {Promise<MuseumSet[]>} A promise that resolves to an array of MuseumSet objects.
   */
  async _getMuseumWing(url: string): Promise<MuseumSet[]> {
    const page = await fetchPage(url);

    // Placeholder for parsing the character data
    const parser = new MuseumWingParser(
      url,
      page,
    );

    return parser.parse();
  }
}