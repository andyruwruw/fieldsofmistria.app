// Local Imports
import { BASE_URL } from '../config';
import { Parser } from './parser';

// Types
import { MonsterDrop } from '../models/monsters';

/**
 * The data extracted for a single monster variant row from the Monsters list page.
 */
export interface MonsterListRow {
  id: string;
  name: string;
  type: string;
  variant: string;
  href: string;
  icon: string;
  biome: string;
  'lowest-floor': number;
  'highest-floor': number;
  drops: MonsterDrop[];
}

/**
 * Parses the main monsters list page to extract monster URLs.
 *
 * The Monsters page lays each monster category (Saplings, Rock Clods, ...)
 * out as its own `table.wikitable.mw-collapsible.sortable` with Image / Name
 * / Biome / Drops columns. Multiple rows (color variants) can point at the
 * same detail page href (e.g. every Rock Clod color links to `/wiki/Clod`),
 * so the full per-variant data is captured here and cached statically,
 * keyed by id, for `MonsterPageParser` to look up later.
 */
export class MonsterListParser extends Parser<Record<string, string>[]> {
  /**
   * Leftover data from previous parsing attempts, keyed by monster id.
   */
  static _rows = {} as Record<string, MonsterListRow>;

  /**
   * Parses the HTML page and returns structured data.
   *
   * @returns {Promise<Record<string, string>[]>} A promise that resolves to the parsed data.
   */
  async parse(): Promise<Record<string, string>[]> {
    MonsterListParser._rows = this._parseMonsterTables();

    return Object.values(MonsterListParser._rows).map((row: MonsterListRow) => ({
      id: row.id,
      href: row.href,
      icon: row.icon,
    }));
  }

  /**
   * Looks up the previously parsed row data for a monster id.
   *
   * @param {string} id The monster's id.
   * @returns {MonsterListRow | undefined} The row data, if found.
   */
  static getRow(id: string): MonsterListRow | undefined {
    return MonsterListParser._rows[id];
  }

  /**
   * Parses every monster category table on the page.
   *
   * @returns {Record<string, MonsterListRow>} The parsed rows, keyed by id.
   */
  private _parseMonsterTables(): Record<string, MonsterListRow> {
    const result = {} as Record<string, MonsterListRow>;
    const tables = this._get('table.wikitable.mw-collapsible.sortable');

    for (let i = 0; i < tables.length; i += 1) {
      const table = this._page(tables[i]);
      const type = this._getTableType(table);
      const rows = table.find('tbody > tr');

      for (let j = 1; j < rows.length; j += 1) {
        const row = this._parseMonsterRow(rows.eq(j), type);

        if (row) {
          result[row.id] = row;
        }
      }
    }

    return result;
  }

  /**
   * Determines the monster type (category) for a table from the heading
   * that precedes it on the page (e.g. "Saplings" -> "Sapling").
   *
   * @param {any} table The table to find the heading for.
   * @returns {string} The singular monster type.
   */
  private _getTableType(table: any): string {
    const heading = table.prevAll('h2, h3').first().text().trim();

    return heading.replace(/s$/, '');
  }

  /**
   * Parses a single row (monster variant) from a category table.
   *
   * @param {any} row The row to parse.
   * @param {string} type The monster type (category) this row belongs to.
   * @returns {MonsterListRow | null} The parsed row, or null if it has no name/href.
   */
  private _parseMonsterRow(
    row: any,
    type: string,
  ): MonsterListRow | null {
    const cells = row.find('> td');

    if (cells.length < 4) {
      return null;
    }

    const imageCell = cells.eq(0);
    const nameCell = cells.eq(1);
    const biomeCell = cells.eq(2);
    const dropsCell = cells.eq(3);

    const href = imageCell.find('a').attr('href');
    const icon = imageCell.find('img').attr('src');
    const variant = nameCell.text().trim();

    if (!href || !variant) {
      return null;
    }

    const name = this._computeFullName(variant, type);
    const id = name.toLowerCase().replace(/\s+/g, '-').trim();
    const { biome, lowestFloor, highestFloor } = this._parseBiome(biomeCell);

    return {
      id,
      name,
      type,
      variant,
      href: `${BASE_URL}${href}`,
      icon: icon ? `${BASE_URL}${icon}` : '',
      biome,
      'lowest-floor': lowestFloor,
      'highest-floor': highestFloor,
      drops: this._parseDrops(dropsCell),
    };
  }

  /**
   * Computes a full, unique monster name from a row's bare variant name and
   * its type. Many category tables only list the color/variant (e.g. "Blue",
   * "Copper") rather than the full monster name, so this fills in the type
   * where it's missing while avoiding duplicating words that are already
   * present (e.g. the "Sapling" row in the Saplings table, or "Cool Sapling",
   * already contain the type name).
   *
   * @param {string} variant The raw variant name from the Name column.
   * @param {string} type The monster type (category).
   * @returns {string} The computed full name.
   */
  private _computeFullName(
    variant: string,
    type: string,
  ): string {
    const variantLower = variant.toLowerCase();
    const typeLower = type.toLowerCase();
    const firstTypeWord = typeLower.split(' ')[0];

    if (variantLower === typeLower || variantLower === firstTypeWord) {
      return type;
    }

    if (variantLower.includes(typeLower)) {
      return variant;
    }

    return `${variant} ${type}`;
  }

  /**
   * Parses the biome cell of a monster row, extracting the biome name and
   * the lowest/highest floor the monster can be found on.
   *
   * @param {any} cell The biome table cell.
   * @returns {{ biome: string, lowestFloor: number, highestFloor: number }} The parsed biome data.
   */
  private _parseBiome(cell: any): { biome: string, lowestFloor: number, highestFloor: number } {
    const biome = cell.find('a').first().text().trim();

    // The cell's text also contains a hidden `<span style="display:none">`
    // sort key digit ahead of the biome link, so only pull floor numbers out
    // of the "(floors X-Y[, A-B])" segment rather than the whole cell text.
    const floorsMatch = cell.text().match(/\(floors\s*([\d,\s-]+)\)/);
    const floors = floorsMatch ? (floorsMatch[1].match(/\d+/g) || []).map((value: string) => parseInt(value, 10)) : [];

    if (floors.length === 0) {
      return {
        biome,
        lowestFloor: 0,
        highestFloor: 0,
      };
    }

    return {
      biome,
      lowestFloor: Math.min(...floors),
      highestFloor: Math.max(...floors),
    };
  }

  /**
   * Parses the drops cell of a monster row.
   *
   * @param {any} cell The drops table cell.
   * @returns {MonsterDrop[]} The parsed drops.
   */
  private _parseDrops(cell: any): MonsterDrop[] {
    const drops = [] as MonsterDrop[];
    const items = cell.find('li');

    for (let i = 0; i < items.length; i += 1) {
      const item = this._page(items[i]);
      const link = item.find('a').filter((_: number, el: any) => (this._page(el).text().trim() !== '')).first();
      const name = link.text().trim();

      if (!name) {
        continue;
      }

      const chanceMatch = item.text().match(/\((\d+(?:\.\d+)?)%\)/);
      const chance = chanceMatch ? parseFloat(chanceMatch[1]) : 0;

      drops.push({
        id: name.toLowerCase().replace(/\s+/g, '-').trim(),
        chance,
      });
    }

    return drops;
  }
}
