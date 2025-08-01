// Local Imports
import { ItemsService } from '../services/items.service';
import { BASE_URL } from '../config';
import { Parser } from './parser';

/**
 * Parses the character gift page to extract character URLs.
 */
export class CharacterGiftParser extends Parser<Record<string, string[]>> {
  /**
   * Parses the HTML page and returns structured data.
   *
   * @returns {Promise<Record<string, string[]>>} A promise that resolves to the parsed data.
   */
  async parse(): Promise<Record<string, string[]>> {
    const mainChildren = this._getChildren('div.mw-content-ltr');

    const gifts: Record<string, string[]> = {
      loved: [],
      liked: [],
      disliked: [],
      hated: [],
    };

    const loved = this._condenseTable(this._parseTable(this._firstTagAfterTag(
      'table',
      'h2',
      mainChildren,
      [
        'Loved Gift',
        'Loved Gifts',
      ],
    )));

    gifts.loved = this._parseGiftTable(loved);

    const liked = this._condenseTable(this._parseTable(this._firstTagAfterTag(
      'table',
      'h2',
      mainChildren,
      [
        'Liked Gift',
        'Liked Gifts',
      ],
    )));

    gifts.liked = this._parseGiftTable(liked);

    const disliked = this._condenseTable(this._parseTable(this._firstTagAfterTag(
      'table',
      'h2',
      mainChildren,
      [
        'Disliked Gift',
        'Disliked Gifts',
      ],
    )));

    gifts.disliked = this._parseGiftTable(disliked);

    const hated = this._condenseTable(this._parseTable(this._firstTagAfterTag(
      'table',
      'h2',
      mainChildren,
      [
        'Hated Gift',
        'Hated Gifts',
      ],
    )));

    gifts.hated = this._parseGiftTable(hated);

    return gifts;
  }

  /**
   * Parses a gift table and extracts the gift names.
   *
   * @param {Record<string, any> | undefined} table The table to parse.
   * @return {string[]} An array of gift names.
   */
  _parseGiftTable(table: Record<string, any> | undefined): string[] {
    if (!table) {
      return [];
    }

    const gifts = [] as string[];

    const body = table.body.filter((row: Record<string, any>) => (Object.keys(row).length > 0));

    for (let i = 0; i < body.length; i += 1) {
      const row = body[i];

      if ('Name' in row
        && row['Name']
        && 'text' in row['Name']) {
        const id = row['Name'].text.trim()
          .toLowerCase()
          .replace(/\s+/g, '-');

        if (!id) {
          continue;
        }

        if (!(gifts.includes(id))) {
          gifts.push(id);

          const href = row['Name'].href || '';

          if (href) {
            ItemsService.queueItem(
              id,
              `${BASE_URL}${href}`,
            );
          }
        }
      }
    }

    return gifts;
  }
}