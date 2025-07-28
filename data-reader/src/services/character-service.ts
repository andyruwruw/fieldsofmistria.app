// Local Imports
import { CharacterPageParser } from '../parsers/character-page-parser';
import { CharacterListParser } from '../parsers/character-list-parser';
import { CHARACTER_LIST_URL } from '../config';
import { fetchPage } from './scraper';

// Types
import { Character } from '../models/characters';

/**
 * Service for managing character data.
 */
export class CharacterService {
  /**
   * Fetches character data for all characters.
   *
   * @returns {Promise<Character[]>} A promise that resolves to an array of Character objects.
   */
  async fetch(): Promise<Character[]> {
    const characterUrls = await this._getCharacterList();

    const characterPromises = [];

    // for (let i = 0; i < 2; i += 1) {
    for (let i = 0; i < characterUrls.length; i += 1) {
      const url = characterUrls[i];

      // Fetch each character's data
      // characterPromises.push(this._getCharacter('https://fieldsofmistria.wiki.gg/wiki/Adeline'));
      characterPromises.push(this._getCharacter(url));
    }

    return Promise.all(characterPromises);
  }

  /**
   * Fetches the list of character URLs from the character list page.
   *
   * @returns {Promise<string[]>} A promise that resolves to an array of character URLs.
   */
  async _getCharacterList(): Promise<string[]> {
    const page = await fetchPage(CHARACTER_LIST_URL);

    const parser = new CharacterListParser(
      CHARACTER_LIST_URL,
      page,
    );

    return parser.parse();
  }

  /**
   * Fetches data for a specific character.
   *
   * @param {string} url - The URL of the character page.
   * @returns {Promise<Character>} A promise that resolves to a Character object.
   */
  async _getCharacter(url: string): Promise<Character> {
    const page = await fetchPage(url);

    // Placeholder for parsing the character data
    const parser = new CharacterPageParser(
      url,
      page,
    );

    return parser.parse();
  }
}