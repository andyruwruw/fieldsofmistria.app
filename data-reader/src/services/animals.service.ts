// Local Imports
import { normalizeStringLength } from '../utils/convert';
import { AnimalPageParser } from '../parsers/animal.parser';
import { AnimalListParser } from '../parsers/animal-list.parser';
import { ANIMALS_URL } from '../config';
import { fetchPage } from '../utils/scraper';

// Types
import { Animal } from '../models/animals';

/**
 * Service for managing animal data.
 */
export class AnimalsService {
  /**
   * Fetches animal data for all animals.
   *
   * @returns {Promise<Animal[]>} A promise that resolves to an array of Animal objects.
   */
  async fetch(): Promise<Animal[]> {
    const animalUrls = await this._getAnimalList();

    const animalPromises = [];
    let last = 0;

    // for (let i = 0; i < 2; i += 1) {
    for (let i = 0; i < animalUrls.length; i += 1) {
      const url = animalUrls[i];

      const percent = Math.floor((i / animalUrls.length) * 10);
      if (percent > last) {
        last = percent;
        console.log(`${normalizeStringLength(`${percent * 10}%`, 4)} | Fetching Animals`);
      }

      // Fetch each animal's data
      animalPromises.push(this._getAnimalPage(url));
    }

    const result = await Promise.all(animalPromises);

    console.log(`100% | Done Fetching Animals`);

    return result;
  }

  /**
   * Fetches a list of animal URLs.
   *
   * @returns {Promise<string[]>} A promise that resolves to an array of animal URLs.
   */
  async _getAnimalList(): Promise<string[]> {
    const page = await fetchPage(ANIMALS_URL);

    const parser = new AnimalListParser(
      ANIMALS_URL,
      page,
    );

    return parser.parse();
  }

  /**
   * Fetches data for all an animal.
   *
   * @returns {Promise<Animal>} A promise that resolves to an Animal object.
   */
  async _getAnimalPage(url: string): Promise<Animal> {
    const page = await fetchPage(url);

    // Placeholder for parsing the character data
    const parser = new AnimalPageParser(
      url,
      page,
    );

    return parser.parse();
  }
}