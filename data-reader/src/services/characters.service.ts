// Local Imports
import { normalizeStringLength } from '../utils/convert';
import { CharacterPageParser } from '../parsers/character.parser';
import { CharacterListParser } from '../parsers/character-list.parser';
import { CHARACTER_LIST_URL } from '../config';
import { fetchPage } from '../utils/scraper';
import wait from '../utils/wait';

// Types
import { Character } from '../models/characters';

/**
 * Service for managing character data.
 */
export class CharactersService {
  /**
   * Fetches character data for all characters.
   *
   * @returns {Promise<Character[]>} A promise that resolves to an array of Character objects.
   */
  async fetch(): Promise<Character[]> {
    const characterUrls = await this._getCharacterList();

    const characterPromises = [];
    let last = 0;

    // for (let i = 0; i < 2; i += 1) {
    for (let i = 0; i < characterUrls.length; i += 1) {
      const url = characterUrls[i];

      const percent = Math.floor((i / characterUrls.length) * 10);
      if (percent > last) {
        last = percent;
        console.log(`${normalizeStringLength(`${percent * 10}%`, 4)} | Fetching Characters`);
      }

      await wait(500);

      // Fetch each character's data
      // characterPromises.push(this._getCharacter('https://fieldsofmistria.wiki.gg/wiki/Adeline'));
      characterPromises.push(this._getCharacter(url));
    }

    const result = await Promise.all(characterPromises);

    console.log(`100% | Done Fetching Characters`);

    return result;
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