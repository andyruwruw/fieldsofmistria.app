// Local Imports
import { BASE_URL } from '../config';
import { Parser } from './parser';

// Types
import {
  Crop,
  CropType,
} from '../models/crops';
import { Season } from '../models/weather';
/**
 * Parses the crops page.
 */
export class CropListParser extends Parser<Crop[]> {
  /**
   * Parses the HTML page and returns structured data.
   *
   * @returns {Promise<Crop[]>} A promise that resolves to the parsed data.
   */
  async parse(): Promise<Crop[]> {
    const mainChildren = this._getChildren('div.mw-content-ltr');

    console.log(`0%   | Fetching Crops (Spring)`);

    const springTable = this._condenseTable(this._parseTable(this._firstTagAfterTag(
      'table',
      'h3',
      mainChildren,
      [ 'Spring' ],
    )));

    const springCrops = this._parseCropTable(
      springTable,
      'spring' as Season,
    ) || [];

    console.log(`25%  | Fetching Crops (Summer)`);

    const summerTable = this._condenseTable(this._parseTable(this._firstTagAfterTag(
      'table',
      'h3',
      mainChildren,
      [ 'Summer' ],
    )));

    const summerCrops = this._parseCropTable(
      summerTable,
      'summer' as Season,
    ) || [];

    console.log(`50%  | Fetching Crops (Fall)`);

    const fallTable = this._condenseTable(this._parseTable(this._firstTagAfterTag(
      'table',
      'h3',
      mainChildren,
      [ 'Fall' ],
    )));

    const fallCrops = this._parseCropTable(
      fallTable,
      'fall' as Season,
    ) || [];

    console.log(`75%  | Fetching Crops (Winter)`);

    const winterTable = this._condenseTable(this._parseTable(this._firstTagAfterTag(
      'table',
      'h3',
      mainChildren,
      [ 'Winter' ],
    )));

    const winterCrops = this._parseCropTable(
      winterTable,
      'winter' as Season,
    ) || [];

    console.log(`100% | Done Fetching Crops`);

    return [
      ...springCrops,
      ...summerCrops,
      ...fallCrops,
      ...winterCrops,
    ];
  }

  /**
   * Parses a crop table and extracts the crops.
   *
   * @param {Record<string, any> | undefined} table The table to parse.
   * @return {Crop[]} An array of crops.
   */
  _parseCropTable(
    table: Record<string, any> | undefined,
    season: Season = 'spring',
  ): Crop[] {
    if (!table) {
      return [];
    }

    const crops = [] as Crop[];

    const body = table.body.filter((row: Record<string, any>) => (Object.keys(row).length > 0));

    for (let i = 0; i < body.length; i += 1) {
      const row = body[i];

      const name = row.Name.text.trim();
      
      const growthTime = row['Growth Time'].text instanceof Array ? parseInt((row['Growth Time'] as unknown as Record<string, string[]>).text[0].trim().replace(' Days', '')) : parseInt((row['Growth Time'].text as string).replace(' Days', ''));
      const regrowTime = row['Growth Time'].text instanceof Array ? parseInt((row['Growth Time'] as unknown as Record<string, string[]>).text[1].trim().replace(' Days', '')) : 0;

      crops.push({
        id: name.toLowerCase().replace(/\s+/g, '-'),
        name: name,
        description: row.Description.text.trim(),
        'growth-time': growthTime,
        'regrow-time': regrowTime,
        locations: [],
        seasons: [ season ],
        type: 'crop' as CropType,
        sell: row['Sell Price'] ? parseInt(row['Sell Price'].text.trim().replace('t', ''), 0): 0,
        image: row.Image ? `${BASE_URL}${row.Image.src.trim()}` : '',
        'seed-image': row.Seeds ? `${BASE_URL}${row.Seeds.src.trim()}` : '',
        href: `${BASE_URL}${row.Name.href}`,
      });
    }

    return crops;
  }
}