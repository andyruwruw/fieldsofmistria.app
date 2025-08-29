// Local Imports
import { convertTesseraeString } from '../utils/convert';
import { AnimalListParser } from './animal-list.parser';
import { BASE_URL } from '../config';
import { Parser } from './parser';

// Types
import {
  Animal,
  AnimalHome,
  AnimalProduce,
} from '../models/animals';

/**
 * Parses a specific animal page.
 */
export class AnimalPageParser extends Parser<Animal> {
  /**
   * Parses the HTML page and returns structured data.
   *
   * @returns {Promise<Animal>} A promise that resolves to the parsed data.
   */
  async parse(): Promise<Animal> {
    const name = await this._getName();

    return {
      id: name.toLowerCase().replace(/\s+/g, '-'),
      name,
      home: await this._getHome(name.toLowerCase().replace(/\s+/g, '-')),
      prices: await this._getPrices(),
      produce: await this._getProduce(),
      colors: await this._getColors(),
      'small-icon': await this._getSmallIcon(name.toLowerCase().replace(/\s+/g, '-')),
      images: await this._getImages(),
      href: this._url,
    };
  }

  /**
   * Extracts the animal's name from the page.
   *
   * @returns {Promise<string>} A promise that resolves to the animal's name.
   */
  async _getName(): Promise<string> {
    return this._getText('span.mw-page-title-main') || 'Unknown Animal';
  }

  /**
   * Extracts the animal's home location.
   *
   * @param {string} id - The animal's ID.
   * @returns {Promise<AnimalHome>} A promise that resolves to the animal's home location.
   */
  async _getHome(id: string): Promise<AnimalHome> {
    return AnimalListParser.getAnimalHome(id);
  }

  /**
   * Extracts the prices for the animal.
   * @returns {Promise<number[]>} A promise that resolves to the animal's prices.
   */
  async _getPrices(): Promise<number[]> {
    const mainChildren = this._getChildren('div.mw-content-ltr');

    const prices = this._condenseTable(this._parseTable(this._firstTagAfterTag(
      'table',
      'p',
      mainChildren,
      [],
    )));

    if (!prices || prices.length === 0) {
      return []; // No price table found
    }

    const result = [];

    for (let i = 0; i < prices.body.length; i += 1) {
      const price = prices.body[i]['1'].text;

      result.push(convertTesseraeString(
        price,
        -1,
      ));
    }

    return result;
  }

  /**
   * Extracts the produce items for the animal.
   *
   * @returns {Promise<AnimalProduce[]>} A promise that resolves to the animal's produce items.
   */
  async _getProduce(): Promise<AnimalProduce[]> {
    return [];
  }

  /**
   * Extracts the colors for the animal.
   *
   * @returns {Promise<Record<string, any>[]>} A promise that resolves to the animal's colors.
   */
  async _getColors(): Promise<Record<string, any>[]> {
    const data = [];
    const mainChildren = this._getChildren('div.mw-content-ltr');

    const tableWrapper = this._firstTagAfterTag(
      'div',
      'h2',
      mainChildren,
      [ 'Colors' ],
    );

    const tables = tableWrapper.children.filter((element: any) => (element.name === 'table'));

    for (let i = 0; i < tables.length; i += 1) {
      const table = this._condenseTable(this._parseTable(tables[i]));

      if (!table) {
        continue;
      }

      const tier = parseInt(table.header[0].replace('Tier ', ''));

      for (let j = 0; j < table.body.length; j += 1) {
        const keys = Object.keys(table.body[j]);

        if (keys.length === 1) {
          continue;
        }

        const color = {
          tier,
          color: '',
          images: {} as Record<string, string>,
        };

        for (let key of keys) {
          if (key.includes('Tier')) {
            color.color = table.body[j][key].text;
          } else if (table.body[j][key].src) {
            color.images[key] = `${BASE_URL}/${table.body[j][key].src}`;
          }
        }

        data.push(color);
      }
    }

    return data;
  }

  /**
   * Extracts the small icon for the animal.
   *
   * @param {string} id - The animal's ID.
   * @returns {Promise<string>} A promise that resolves to the animal's small icon URL.
   */
  async _getSmallIcon(id: string): Promise<string> {
    return AnimalListParser.getAnimalSmallIcon(id);
  }

  /**
   * Extracts the images for the animal.
   *
   * @returns {Promise<Record<string, string[]>>} A promise that resolves to the animal's images.
   */
  async _getImages(): Promise<Record<string, string[]>> {
    return {};
  }
}