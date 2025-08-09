// Local Imports
import { Parser } from './parser';

// Types
import { Artifact } from '../models/artifacts';

/**
 * Parses a artifact page to extract artifact information.
 */
export class ArtifactPageParser extends Parser<Artifact> {
  /**
   * Parses the HTML page and returns structured data.
   *
   * @returns {Promise<Artifact>} A promise that resolves to the parsed data.
   */
  async parse(): Promise<Artifact> {
    const data = await this._parseAside();

    try {
      // Implement the parsing logic to extract artifact information from the data
      return {
        id: data.name.toLowerCase().replace(/\s+/g, '-'),
        name: data.name,
        description: data.description,
        sell: data.sell,
        location: 'locations' in data ? data.locations.filter((location: string) => location !== 'data-sort-value="">').join('') : 'Any',
        rarity: 'Rarity' in data ? data.Rarity.text : 'Unknown',
        image: data.image,
        href: this._url,
      } as unknown as Artifact;
    } catch (error) {
      console.log(error);
    }

    return {} as Artifact;
  }
}
