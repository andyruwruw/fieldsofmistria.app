// Local Imports
import { Parser } from './parser';

// Types
import { AnimalHome } from '../models/animals';

/**
 * Parses the main animal list page to extract animal URLs.
 */
export class AnimalListParser extends Parser<string[]> {
  /**
   * Leftover data from previous parsing attempts.
   * This is used to store any data that might be needed later.
   */
  static _data = {} as Record<string, any>;

  /**
  /**
   * Parses the HTML page and returns structured data.
   *
   * @returns {Promise<string[]>} A promise that resolves to the parsed data.
   */
  async parse(): Promise<string[]> {
    AnimalListParser._data = this._parseNavigationTable();

    const animalUrls = [];

    for (let location in AnimalListParser._data.body) {
      const animals = AnimalListParser._data.body[location];

      for (let id in animals) {
        const animal = animals[id];
        const href = animal.href;

        if (!href) {
          continue;
        }

        animalUrls.push(href);
      }
    }

    return animalUrls;
  }

  /**
   * Parses the navigation table to extract animal home.
   *
   * @returns {Record<string, any>} An object containing animal data categorized by home location.
   */
  static getAnimalHome(id: string): AnimalHome {
    for (let location in this._data.body) {

      if (!this._data.body[location]) {
        continue;
      }

      if (id in this._data.body[location]) {
        return location as AnimalHome;
      }
    }

    return 'Unknown';
  }

  /**
   * Parses the navigation table to extract animal small icon.
   *
   * @param {string} id - The animal's ID.
   * @returns {string} The URL of the animal's small icon.
   */
  static getAnimalSmallIcon(id: string): string {
    for (let location in this._data.body) {
      if (id in this._data.body[location]) {
        return this._data.body[location][id]['small-icon'];
      }
    }

    return '';
  }
}
