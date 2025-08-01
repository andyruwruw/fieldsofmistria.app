// Local Imports
import { Parser } from './parser';

// Types
import {
  Crop,
  CropType,
} from '../models/crops';

/**
 * Parses a fruit page to extract fruit information.
 */
export class FruitPageParser extends Parser<Crop> {
  /**
   * Parses the HTML page and returns structured data.
   *
   * @returns {Promise<Crop>} A promise that resolves to the parsed data.
   */
  async parse(): Promise<Crop> {
    const data = await this._parseAside();

    // Implement the parsing logic to extract crop information from the data
    return {
      ...data,
      type: 'fruit' as CropType,
      href: this._url,
    } as unknown as Crop;
  }
}
