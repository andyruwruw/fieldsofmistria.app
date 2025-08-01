// Local Imports
import { Parser } from './parser';

// Types
import {
  Crop,
  CropType,
} from '../models/crops';

/**
 * Parses a forageable page to extract forageable information.
 */
export class ForageablePageParser extends Parser<Crop> {
  /**
   * Parses the HTML page and returns structured data.
   *
   * @returns {Promise<Crop>} A promise that resolves to the parsed data.
   */
  async parse(): Promise<Crop> {
    const data = await this._parseAside();

    // Implement the parsing logic to extract forageable information from the data
    return {
      ...data,
      type: 'forageable' as CropType,
      href: this._url,
    } as unknown as Crop;
  }
}
