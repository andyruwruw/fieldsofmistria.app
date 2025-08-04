// Local Imports
import { Parser } from './parser';

// Types
import { Fish } from '../models/fish';

/**
 * Parses a fish page to extract fish information.
 */
export class FishPageParser extends Parser<Fish> {
  /**
   * Parses the HTML page and returns structured data.
   *
   * @returns {Promise<Fish>} A promise that resolves to the parsed data.
   */
  async parse(): Promise<Fish> {
    const data = await this._parseAside();
    try {
      // Implement the parsing logic to extract fish information from the data
      return {
        id: data.name.toLowerCase().replace(/\s+/g, '-'),
        name: data.name,
        description: data.description,
        sell: data.sell,
        location: 'locations' in data ? data.locations.filter((location: string) => location !== 'data-sort-value="">').join('') : 'Any',
        seasons: data.seasons,
        weather: data.Weather.text instanceof Array ? data.Weather.text : [ data.Weather.text ],
        rarity: 'Rarity' in data ? data.Rarity.text : 'Unknown',
        size: 'Size' in data ? data.Size.text : 'Any',
        catchable: data['Fishing Pole'].text === 'Yes',
        diveable: 'Diveable' in data && data['Diveable'].text === 'Yes',
        image: data.image,
        href: this._url,
      } as unknown as Fish;
    } catch (error) {
      console.log(data);
      console.log(error);
    }

    return {} as Fish;
  }
}
