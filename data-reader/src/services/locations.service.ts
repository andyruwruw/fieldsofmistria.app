// Local Imports
import { fetchPage } from '../utils/scraper';

// Types
import { EVENTS_URL } from '../config';
import { Location } from '../models/locations';

/**
 * Service for managing location data.
 */
export class LocationsService {
  /**
   * Fetches location data for all locations.
   *
   * @returns {Promise<Location[]>} A promise that resolves to an array of Location objects.
   */
  async fetch(): Promise<Location[]> {
    return [];
  }
}