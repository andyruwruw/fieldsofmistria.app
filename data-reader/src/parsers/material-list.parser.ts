// Local Imports
import { convertTesseraeString } from '../utils/convert';
import { BASE_URL } from '../config';
import { Parser } from './parser';

// Types
import { MaterialRecipe } from '../models/materials';

/**
 * Parses the main materials list page. The page is a single big table with
 * one row per material (Image, Name, Description, Value, Skills, Source,
 * Example Recipes, Museum columns). Individual materials also have their own
 * detail pages, but the detail page's infobox doesn't carry the Skills,
 * Source, Example Recipes, or Museum columns, so this parser stashes the
 * full row data in a static lookup that `MaterialPageParser` reads from,
 * mirroring the `AnimalListParser` pattern.
 */
export class MaterialListParser extends Parser<Record<string, string>[]> {
  /**
   * Row data for every material, keyed by material ID.
   */
  static _data: Record<string, Record<string, any>> = {};

  /**
   * Parses the HTML page and returns structured data.
   *
   * @returns {Promise<Record<string, string>[]>} A promise that resolves to the parsed data.
   */
  async parse(): Promise<Record<string, string>[]> {
    const table = this._getFirst('table.wikitable.mw-collapsible.sortable');
    const rows = table.find('tbody > tr').toArray();

    const materialUrls = [];

    for (let i = 0; i < rows.length; i += 1) {
      const row = this._page(rows[i]);
      const cells = row.find('td');

      if (cells.length < 8) {
        continue; // Header row or malformed row
      }

      const nameLink = cells.eq(1).find('a').first();
      const name = nameLink.text().trim();

      if (!name) {
        continue;
      }

      const id = name.toLowerCase().replace(/\s+/g, '-').trim();
      const href = `${BASE_URL}${nameLink.attr('href')}`;

      MaterialListParser._data[id] = {
        id,
        name,
        href,
        description: cells.eq(2).text().trim(),
        value: convertTesseraeString(cells.eq(3).text().trim()),
        skills: this._parseSkills(cells.eq(4)),
        source: this._parseLines(cells.eq(5)),
        recipes: this._parseRecipes(cells.eq(6)),
        ...this._parseMuseum(cells.eq(7)),
      };

      materialUrls.push({
        id,
        href,
      });
    }

    return materialUrls;
  }

  /**
   * Parses the Skills column of a row into a list of skill names.
   *
   * @param {Cheerio<any>} cell The Skills table cell.
   * @returns {string[]} The skill names associated with the row.
   */
  _parseSkills(cell: any): string[] {
    const skills = new Set<string>();

    cell.find('a').each((_: number, a: any) => {
      const text = this._page(a).text().trim();

      if (text) {
        skills.add(text);
      }
    });

    return Array.from(skills);
  }

  /**
   * Parses the Example Recipes column of a row into a list of recipes/items
   * that use the material.
   *
   * @param {Cheerio<any>} cell The Example Recipes table cell.
   * @returns {MaterialRecipe[]} The recipes/items that use the material.
   */
  _parseRecipes(cell: any): MaterialRecipe[] {
    const seen = new Set<string>();
    const recipes: MaterialRecipe[] = [];

    cell.find('a').each((_: number, a: any) => {
      const $a = this._page(a);
      const name = $a.text().trim();

      if (!name) {
        return; // Skip icon-only links
      }

      const id = name.toLowerCase().replace(/\s+/g, '-').trim();

      if (seen.has(id)) {
        return;
      }

      seen.add(id);
      recipes.push({
        id,
        name,
        href: `${BASE_URL}${$a.attr('href')}`,
      });
    });

    return recipes;
  }

  /**
   * Parses the Museum column of a row into donatable/wing data.
   *
   * @param {Cheerio<any>} cell The Museum table cell.
   * @returns {Record<string, any>} The donatable status and museum wing.
   */
  _parseMuseum(cell: any): Record<string, any> {
    const lines = this._parseLines(cell);

    return {
      donatable: lines[0] === 'Yes',
      museumWing: lines[1] || '',
    };
  }

  /**
   * Parses a table cell's contents into a list of lines, splitting on `<br>`
   * tags and stripping any remaining HTML.
   *
   * @param {Cheerio<any>} cell The table cell to parse.
   * @returns {string[]} The cell's contents split into lines.
   */
  _parseLines(cell: any): string[] {
    const html = cell.html() || '';

    const text = html
      .replace(/<span style="display:\s*none">[^<]*<\/span>/gi, '')
      .replace(/<br\s*\/?>/gi, '\n')
      .replace(/<[^>]+>/g, '')
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&#0?39;/g, '\'')
      .replace(/&quot;/g, '"');

    return text
      .split('\n')
      .map((line: string) => (line.replace(/\s+/g, ' ').trim()))
      .filter((line: string) => (line.length > 0));
  }

  /**
   * Gets the stashed row data for a material by ID.
   *
   * @param {string} id The material's ID.
   * @returns {Record<string, any>} The material's row data, or an empty object if not found.
   */
  static getRow(id: string): Record<string, any> {
    return this._data[id] || {};
  }
}
