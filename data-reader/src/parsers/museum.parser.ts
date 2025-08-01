// Local Imports
import { Parser } from './parser';

// Types
import { MuseumWing } from '../models/museum';

/**
 * Parses the main museum page to extract museum wing URLs.
 */
export class MuseumParser extends Parser<MuseumWing[]> {
  /**
   * Parses the HTML page and returns structured data.
   *
   * @returns {Promise<MuseumWing[]>} A promise that resolves to the parsed data.
   */
  async parse(): Promise<MuseumWing[]> {
    const museumWingsList = this._page('ul.gallery.mw-gallery-packed');

    const wings = [] as MuseumWing[];

    for (let i = 0; i < museumWingsList.length; i++) {
      const row = museumWingsList[i];

      for (let j = 0; j < row.children.length; j += 1) {
        const wing = row.children[j];

        if (wing.type === 'text') {
          continue;
        }

        const wrapper = (wing as Record<string, any>).children[0];

        const [
          fill,
          imageElement,
          fill2,
          titleElement,
        ] = wrapper.children;

        const image = this._parseValue(imageElement) as Record<string, string>;
        const title = this._parseValue(titleElement) as Record<string, string>;

        wings.push({
          id: title.text.toLowerCase().replace(/\s+/g, '-'),
          name: title.text,
          image: image.src,
          href: image.href,
        });
      }
    }

    return wings;
  }
}
