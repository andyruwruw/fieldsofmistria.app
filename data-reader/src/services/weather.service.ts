// Local Imports
import { fetchPage } from '../utils/scraper';

// Types
import { WEATHER_URL } from '../config';
import { Weather } from '../models/weather';

/**
 * Service for managing weather data.
 */
export class WeatherService {
  /**
   * Fetches weather data for all locations.
   *
   * @returns {Promise<Weather[]>} A promise that resolves to an array of Weather objects.
   */
  async fetch(): Promise<Weather[]> {
    return [];
  }
}