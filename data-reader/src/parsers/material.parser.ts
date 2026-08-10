// Local Imports
import { MaterialListParser } from './material-list.parser';
import { Parser } from './parser';

// Types
import { Material } from '../models/materials';

/**
 * Parses a specific material page. The page's infobox (aside) carries name,
 * image, description, sell price, and sometimes location/season/health/stamina,
 * but not the skills/source/recipes/museum columns from the materials list
 * table, so those are pulled from `MaterialListParser`'s stashed row data.
 */
export class MaterialPageParser extends Parser<Material> {
  /**
   * Parses the HTML page and returns structured data.
   *
   * @returns {Promise<Material>} A promise that resolves to the parsed data.
   */
  async parse(): Promise<Material> {
    const data = await this._parseAside();

    try {
      const name = data.name;
      const id = name.toLowerCase().replace(/\s+/g, '-').trim();
      const row = MaterialListParser.getRow(id);
      const location = this._getLocation();

      return {
        id,
        name,
        description: data.description || row.description || '',
        image: data.image || '',
        sell: 'sell' in data ? data.sell : (row.value || 0),
        skills: row.skills || [],
        location: location || 'Unknown',
        locations: location ? [ location.replace(/\s*\([^)]*\)\s*/g, '').trim().toLowerCase().replace(/\s+/g, '-') ] : [],
        seasons: data.seasons || [],
        health: data.health || 0,
        stamina: data.stamina || 0,
        source: row.source || [],
        donatable: !!row.donatable,
        museumWing: row.museumWing || '',
        recipes: row.recipes || [],
        href: this._url,
      } as unknown as Material;
    } catch (error) {
      console.log(error);
    }

    return {} as Material;
  }

  /**
   * Extracts a clean, human readable location string from the infobox's
   * Location field, stripping the hidden sort-key span the base aside
   * parser doesn't account for (e.g. "<span style=\"display:none\">2</span>
   * The Tide Caverns<br>(floors 21-39)" becomes "The Tide Caverns (floors 21-39)").
   *
   * @returns {string} The cleaned location text, or an empty string if there's no Location field.
   */
  _getLocation(): string {
    const html = this._getFirst('div.pi-item[data-source="location"] .pi-data-value').html() || '';

    return html
      .replace(/<span style="display:\s*none">[^<]*<\/span>/gi, '')
      .replace(/<br\s*\/?>/gi, ' ')
      .replace(/<[^>]+>/g, '')
      .replace(/&nbsp;/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }
}
