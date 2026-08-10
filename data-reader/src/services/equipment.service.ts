// Local Imports
import { normalizeStringLength } from '../utils/convert';
import { EquipmentPageParser } from '../parsers/equipment.parser';
import { EquipmentListParser } from '../parsers/equipment-list.parser';
import { EQUIPMENT_URL } from '../config';
import {
  fetchAll,
  fetchPage,
} from '../utils/scraper';

// Types
import { Equipment } from '../models/equipment';

/**
 * Service for managing equipment (armor) data.
 */
export class EquipmentService {
  /**
   * Fetches equipment data for all pieces of equipment.
   *
   * @returns {Promise<Equipment[]>} A promise that resolves to an array of Equipment objects.
   */
  async fetch(): Promise<Equipment[]> {
    const equipmentUrls = (await this._getEquipmentList()).map((item: Record<string, string>): string => (item.href));

    let last = 0;

    const result = await fetchAll(
      equipmentUrls,
      async (url: string, index: number): Promise<Equipment> => {
        const percent = Math.floor((index / equipmentUrls.length) * 10);

        if (percent > last) {
          last = percent;
          console.log(`${normalizeStringLength(`${percent * 10}%`, 4)} | Fetching Equipment`);
        }

        return this._getEquipmentPage(url);
      },
    );

    console.log(`100% | Done Fetching Equipment`);

    return result;
  }

  /**
   * Fetches a list of equipment URLs.
   *
   * @returns {Promise<Record<string, string>[]>} A promise that resolves to an array of equipment URLs.
   */
  async _getEquipmentList(): Promise<Record<string, string>[]> {
    const page = await fetchPage(EQUIPMENT_URL);

    const parser = new EquipmentListParser(
      EQUIPMENT_URL,
      page,
    );

    return parser.parse();
  }

  /**
   * Fetches data for a single piece of equipment.
   *
   * @param {string} url The URL of the equipment page.
   * @returns {Promise<Equipment>} A promise that resolves to an Equipment object.
   */
  async _getEquipmentPage(url: string): Promise<Equipment> {
    const page = await fetchPage(url);

    const parser = new EquipmentPageParser(
      url,
      page,
    );

    return parser.parse();
  }
}
