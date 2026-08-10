// Local Imports
import {
  ANIMAL_COSMETICS_URL,
  ANIMAL_PRODUCTS_URL,
} from '../config';
import { AnimalCosmeticListParser } from '../parsers/animal-cosmetic-list.parser';
import { AnimalProductListParser } from '../parsers/animal-product-list.parser';
import { fetchPage } from '../utils/scraper';

// Types
import {
  AnimalCosmetic,
  AnimalProduct,
} from '../models/ranching';

/**
 * Service for managing ranching data (animal products and animal
 * cosmetics).
 */
export class RanchingService {
  /**
   * Fetches all ranching data.
   *
   * @returns {Promise<{ products: AnimalProduct[], cosmetics: AnimalCosmetic[] }>} A promise that resolves to the ranching data.
   */
  async fetch(): Promise<{ products: AnimalProduct[], cosmetics: AnimalCosmetic[] }> {
    const [
      products,
      cosmetics,
    ] = await Promise.all([
      this._getProducts(),
      this._getCosmetics(),
    ]);

    console.log(`100% | Done Fetching Ranching`);

    return {
      products,
      cosmetics,
    };
  }

  /**
   * Fetches all animal products.
   *
   * @returns {Promise<AnimalProduct[]>} A promise that resolves to an array of AnimalProduct objects.
   */
  async _getProducts(): Promise<AnimalProduct[]> {
    console.log(`0%   | Fetching Animal Products`);

    const page = await fetchPage(ANIMAL_PRODUCTS_URL);

    const parser = new AnimalProductListParser(
      ANIMAL_PRODUCTS_URL,
      page,
    );

    return parser.parse();
  }

  /**
   * Fetches all animal cosmetics.
   *
   * @returns {Promise<AnimalCosmetic[]>} A promise that resolves to an array of AnimalCosmetic objects.
   */
  async _getCosmetics(): Promise<AnimalCosmetic[]> {
    console.log(`0%   | Fetching Animal Cosmetics`);

    const page = await fetchPage(ANIMAL_COSMETICS_URL);

    const parser = new AnimalCosmeticListParser(
      ANIMAL_COSMETICS_URL,
      page,
    );

    return parser.parse();
  }
}
