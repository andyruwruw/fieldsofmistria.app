// Local Imports
import {
  CROPS_URL,
  FORAGEABLE_URL,
  FRUITS_URL,
} from '../config';
import { normalizeStringLength } from '../utils/convert';
import { ForageableListParser } from '../parsers/forageable-list.parser';
import { ForageablePageParser } from '../parsers/forageable.parser';
import { FruitListParser } from '../parsers/fruit-list.parser';
import { FruitPageParser } from '../parsers/fruit.parser';
import { CropListParser } from '../parsers/crop-list.parser';
import { fetchPage } from '../utils/scraper';
import wait from '../utils/wait';

// Types
import { Crop } from '../models/crops';

/**
 * Service for managing crop data.
 */
export class CropsService {
  /**
   * Fetches crop data for all crops.
   *
   * @returns {Promise<Crop[]>} A promise that resolves to an array of Crop objects.
   */
  async fetch(): Promise<Crop[]> {
    const items = [
      ...await this._getCrops(),
      ...await this._getFruits(),
      ...await this._getForageables(),
    ];

    items.sort((a, b) => {
      if (a.name < b.name) {
        return -1;
      }
      if (a.name > b.name) {
        return 1;
      }
      return 0;
    });

    return items;
  }

  /**
   * Fetches crop data for all crops.
   *
   * @returns {Promise<Crop[]>} A promise that resolves to an array of Crop objects.
   */
  async _getCrops(): Promise<Crop[]> {
    const page = await fetchPage(CROPS_URL);

    const parser = new CropListParser(
      CROPS_URL,
      page,
    );

    return parser.parse();
  }

  /**
   * Fetches crop data for all fruits.
   *
   * @returns {Promise<Crop[]>} A promise that resolves to an array of Crop objects representing fruits.
   */
  async _getFruits(): Promise<Crop[]> {
    const page = await fetchPage(FRUITS_URL);
    
    const parser = new FruitListParser(
      FRUITS_URL,
      page,
    );

    const urls = await parser.parse();
    const fruitPromises = [];
    let last = 0;

    for (let i = 0; i < urls.length; i += 1) {
      const fruitPage = await fetchPage(urls[i]);
      const fruitParser = new FruitPageParser(
        urls[i],
        fruitPage,
      );

      const percent = Math.floor((i / urls.length) * 10);
      if (percent > last) {
        last = percent;
        console.log(`${normalizeStringLength(`${percent * 10}%`, 4)} | Fetching Fruits`);
      }

      await wait(500);

      fruitPromises.push(fruitParser.parse());
    }

    const result = await Promise.all(fruitPromises);

    console.log(`100% | Done Fetching Fruits`);

    return result;
  }

  /**
   * Fetches forageable crop data.
   *
   * @returns {Promise<Crop[]>} A promise that resolves to an array of Crop objects representing forageables.
   */
  async _getForageables(): Promise<Crop[]> {
    const page = await fetchPage(FORAGEABLE_URL);
    
    const parser = new ForageableListParser(
      FORAGEABLE_URL,
      page,
    );

    const urls = await parser.parse();
    const forageablePromises = [];
    let last = 0;

    for (let i = 0; i < urls.length; i += 1) {
      const forageablePage = await fetchPage(urls[i]);
      const forageableParser = new ForageablePageParser(
        urls[i],
        forageablePage,
      );

      const percent = Math.floor((i / urls.length) * 10);
      if (percent > last) {
        last = percent;
        console.log(`${normalizeStringLength(`${percent * 10}%`, 4)} | Fetching Forageables`);
      }

      await wait(500);

      forageablePromises.push(forageableParser.parse());
    }

    const result = await Promise.all(forageablePromises);

    console.log(`100% | Done Fetching Forageables`);

    return result;
  }
}