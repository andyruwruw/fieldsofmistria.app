// Local Imports
import { FestivalsParser } from '../parsers/festivals.parser';
import { EVENTS_URL } from '../config';
import {
  fetchAll,
  fetchPage,
} from '../utils/scraper';

// Types
import { Event } from '../models/events';
import { normalizeStringLength } from '../utils/convert';
import { FestivalPageParser } from '../parsers/festival.parser';

/**
 * Service for managing festival data.
 */
export class FestivalsService {
  /**
   * Fetches festival data for all festivals.
   *
   * @returns {Promise<Event[]>} A promise that resolves to an array of Event objects.
   */
  async fetch(): Promise<Event[]> {
    const festivalUrls = await this._getEventUrls();

    let last = 0;

    const result = await fetchAll(festivalUrls, async (url: string, i: number): Promise<Event> => {
      const percent = Math.floor((i / festivalUrls.length) * 10);
      if (percent > last) {
        last = percent;
        console.log(`${normalizeStringLength(`${percent * 10}%`, 4)} | Fetching Festivals`);
      }

      return this._getFestival(url);
    });

    console.log(`100% | Done Fetching Festivals`);

    return result;
  }

  /**
   * Fetches data for all festivals.
   *
   * @returns {Promise<string[]>} A promise that resolves to an array of Event objects.
   */
  async _getEventUrls(): Promise<string[]> {
    const page = await fetchPage(EVENTS_URL);

    const parser = new FestivalsParser(
      EVENTS_URL,
      page,
    );

    return parser.parse();
  }

  /**
   * Fetches data for a specific festival.
   *
   * @param {string} url The URL of the festival page.
   * @returns {Promise<Event>} A promise that resolves to an Event object.
   */
  async _getFestival(url: string): Promise<Event> {
    const page = await fetchPage(url);

    const parser = new FestivalPageParser(
      url,
      page,
    );

    return parser.parse();
  }
}