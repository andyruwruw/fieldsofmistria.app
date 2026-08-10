// Local Imports
import { normalizeStringLength } from '../utils/convert';
import { WeaponPageParser } from '../parsers/weapon.parser';
import { WeaponListParser } from '../parsers/weapon-list.parser';
import { WEAPONS_URL } from '../config';
import {
  fetchAll,
  fetchPage,
} from '../utils/scraper';

// Types
import { Weapon } from '../models/weapons';

/**
 * Service for managing weapon data.
 */
export class WeaponsService {
  /**
   * Fetches weapon data for all weapons.
   *
   * @returns {Promise<Weapon[]>} A promise that resolves to an array of Weapon objects.
   */
  async fetch(): Promise<Weapon[]> {
    const weaponUrls = (await this._getWeaponList()).map((item: Record<string, string>): string => (item.href));

    let last = 0;

    const result = await fetchAll(
      weaponUrls,
      async (url: string, index: number): Promise<Weapon> => {
        const percent = Math.floor((index / weaponUrls.length) * 10);

        if (percent > last) {
          last = percent;
          console.log(`${normalizeStringLength(`${percent * 10}%`, 4)} | Fetching Weapons`);
        }

        return this._getWeaponPage(url);
      },
    );

    console.log(`100% | Done Fetching Weapons`);

    return result;
  }

  /**
   * Fetches a list of weapon URLs.
   *
   * @returns {Promise<Record<string, string>[]>} A promise that resolves to an array of weapon URLs.
   */
  async _getWeaponList(): Promise<Record<string, string>[]> {
    const page = await fetchPage(WEAPONS_URL);

    const parser = new WeaponListParser(
      WEAPONS_URL,
      page,
    );

    return parser.parse();
  }

  /**
   * Fetches data for a single weapon.
   *
   * @param {string} url The URL of the weapon page.
   * @returns {Promise<Weapon>} A promise that resolves to a Weapon object.
   */
  async _getWeaponPage(url: string): Promise<Weapon> {
    const page = await fetchPage(url);

    const parser = new WeaponPageParser(
      url,
      page,
    );

    return parser.parse();
  }
}
