// Local Imports
import { normalizeStringLength } from '../utils/convert';
import { LocationPageParser } from '../parsers/location.parser';
import { LocationListParser } from '../parsers/location-list.parser';
import { LOCATIONS_URL } from '../config';
import { fetchAll, fetchPage } from '../utils/scraper';

// Types
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
    const locationUrls = (await this._getLocationList()).map((item: Record<string, string>): string => (item.href));

    let last = 0;

    const result = await fetchAll(locationUrls, async (url: string, index: number): Promise<Location> => {
      const percent = Math.floor((index / locationUrls.length) * 10);

      if (percent > last) {
        last = percent;
        console.log(`${normalizeStringLength(`${percent * 10}%`, 4)} | Fetching Locations`);
      }

      return this._getLocationPage(url);
    });

    console.log(`100% | Done Fetching Locations`);

    return result;
  }

  /**
   * Fetches a list of location URLs.
   *
   * @returns {Promise<Record<string, string>[]>} A promise that resolves to an array of location entries.
   */
  async _getLocationList(): Promise<Record<string, string>[]> {
    const page = await fetchPage(LOCATIONS_URL);

    const parser = new LocationListParser(
      LOCATIONS_URL,
      page,
    );

    return parser.parse();
  }

  /**
   * Fetches data for a single location.
   *
   * @returns {Promise<Location>} A promise that resolves to a Location object.
   */
  async _getLocationPage(url: string): Promise<Location> {
    const page = await fetchPage(url);

    const parser = new LocationPageParser(
      url,
      page,
    );

    return parser.parse();
  }
}
