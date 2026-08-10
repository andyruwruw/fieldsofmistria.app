// Local Imports
import { normalizeStringLength } from '../utils/convert';
import { MaterialPageParser } from '../parsers/material.parser';
import { MaterialListParser } from '../parsers/material-list.parser';
import { MATERIALS_URL } from '../config';
import { fetchPage, fetchAll } from '../utils/scraper';

// Types
import { Material } from '../models/materials';

/**
 * Service for managing material data.
 */
export class MaterialsService {
  /**
   * Fetches material data for all materials.
   *
   * @returns {Promise<Material[]>} A promise that resolves to an array of Material objects.
   */
  async fetch(): Promise<Material[]> {
    const materialUrls = (await this._getMaterialList()).map((item: Record<string, string>): string => (item.href));

    let last = 0;

    const result = await fetchAll(materialUrls, async (url: string, i: number): Promise<Material> => {
      const percent = Math.floor((i / materialUrls.length) * 10);
      if (percent > last) {
        last = percent;
        console.log(`${normalizeStringLength(`${percent * 10}%`, 4)} | Fetching Materials`);
      }

      return this._getMaterialPage(url);
    });

    console.log(`100% | Done Fetching Materials`);

    return result;
  }

  /**
   * Fetches a list of material URLs.
   *
   * @returns {Promise<Record<string, string>[]>} A promise that resolves to an array of material URLs.
   */
  async _getMaterialList(): Promise<Record<string, string>[]> {
    const page = await fetchPage(MATERIALS_URL);

    const parser = new MaterialListParser(
      MATERIALS_URL,
      page,
    );

    return parser.parse();
  }

  /**
   * Fetches data for a single material.
   *
   * @param {string} url The URL of the material's page.
   * @returns {Promise<Material>} A promise that resolves to a Material object.
   */
  async _getMaterialPage(url: string): Promise<Material> {
    const page = await fetchPage(url);

    const parser = new MaterialPageParser(
      url,
      page,
    );

    return parser.parse();
  }
}
