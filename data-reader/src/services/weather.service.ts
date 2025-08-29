// Local Imports
import { WeatherParser } from '../parsers/weather.parser';
import { WEATHER_URL } from '../config';
import { fetchPage } from '../utils/scraper';

// Types
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
    return this._getWeatherPage();
  }

  /**
   * Fetches data for all weather.
   *
   * @returns {Promise<Weather[]>} A promise that resolves to an array of Weather objects.
   */
  async _getWeatherPage(): Promise<Weather[]> {
    const page = await fetchPage(WEATHER_URL);

    const parser = new WeatherParser(
      WEATHER_URL,
      page,
    );

    return parser.parse();
  }
}