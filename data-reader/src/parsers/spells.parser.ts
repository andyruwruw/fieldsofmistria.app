// Local Imports
import { BASE_URL } from '../config';
import { Parser } from './parser';

// Types
import { Spell } from '../models/spells';

/**
 * Parses the main spells page to extract spells.
 */
export class SpellsParser extends Parser<Spell[]> {
  /**
   * Parses the HTML page and returns structured data.
   *
   * @returns {Promise<Spell[]>} A promise that resolves to the parsed data.
   */
  async parse(): Promise<Spell[]> {
    const mainChildren = this._get('div.mw-body-content table');

    const spells: Spell[] = [];

    const data = this._condenseTable(this._parseTable(mainChildren[0]));

    if (!data) {
      return spells;
    }

    for (let row of data.body) {
      const id = row.Name.text.trim().toLowerCase().replace(/[\s\.']+/g, '-');

      const spell: Spell = {
        id,
        name: row.Name.text || '',
        description: row.Description.text || '',
        type: row.Type.text.toLowerCase() || 0,
        image: `${BASE_URL}${row.Image.src}` || '',
        use: this._parseDescription(row.Notes.text) || '',
        mana: (typeof row.Cost.src === 'string' ? 1 : row.Cost.src.length) || 0,
        href: this._url,
      };

      spells.push(spell);
    }

    return spells;
  }

  /**
   * Parses the description text.
   *
   * @param text The description text to parse.
   * @returns The parsed description.
   */
  protected _parseDescription(text: string | string[]): string {
    if (!(text instanceof Array)) {
      return text;
    }

    return text.join(' ')
      .replace('Cave .', 'Cave.')
      .replace('Deep Woods ,', 'Deep Woods,');
  }
}
