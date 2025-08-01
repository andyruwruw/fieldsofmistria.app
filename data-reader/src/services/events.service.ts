// Local Imports
import { fetchPage } from '../utils/scraper';

// Types
import { EVENTS_URL } from '../config';
import { Event } from '../models/events';

/**
 * Service for managing event data.
 */
export class EventsService {
  /**
   * Fetches event data for all events.
   *
   * @returns {Promise<Event[]>} A promise that resolves to an array of Event objects.
   */
  async fetch(): Promise<Event[]> {
    return [];
  }
}