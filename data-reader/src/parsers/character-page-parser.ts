// Local Imports
import { BASE_URL } from '../config';
import { Parser } from './parser';

// Types
import {
  Character,
  CharacterRelation,
  CharacterRelationType,
} from '../models/characters';
import { fetchPage } from '../services/scraper';
import { CharacterGiftParser } from './character-gift-parser';

/**
 * Parses a character page to extract character information.
 */
export class CharacterPageParser extends Parser<Character> {
  /**
   * List of dateable characters.
   * This is a static property that can be used to store characters that are dateable.
   */
  static DateableCharacters = [] as string[];

  /**
   * List of small icons for characters.
   * This is a static property that can be used to store small icons for characters.
   */
  static SmallIcons = {} as Record<string, string>;

  /**
   * Parses the HTML page and returns structured data.
   *
   * @returns {Promise<Character>} A promise that resolves to the parsed data.
   */
  async parse(): Promise<Character> {
    if (CharacterPageParser.DateableCharacters.length === 0) {
      await this._getDateableCharacters();
    }
    const name = await this._getName();

    const giftUrl = `${this._url}/Gifts`;
    const giftPage = await fetchPage(giftUrl);
    const giftParser = new CharacterGiftParser(
      giftUrl,
      giftPage,
    );

    const giftData = await giftParser.parse();

    // Implement the parsing logic to extract character information from the data
    return {
      id: name.toLowerCase().replace(/\s+/g, '-'),
      name,
      occupation: await this._getOccupation(),
      'marital-status': await this._getMaritalStatus(),
      'birthday-season': await this._getBirthdaySeason(),
      'birthday-day': await this._getBirthdayDay(),
      species: await this._getSpecies(),
      gender: await this._getGender(),
      'eye-color': await this._getEyeColor(),
      dateable: await this._isDateable(name),
      relationships: await this._getRelationships(),
      'small-icon-image': await this._getSmallIcon(name),
      ...(await this._getImageUrls()),
      ...giftData,
    } as unknown as Character;
  }

  /**
   * Extracts the character's name from the page.
   *
   * @returns {Promise<string>} A promise that resolves to the character's name.
   */
  async _getName(): Promise<string> {
    const nameElement = this._page('span.mw-page-title-main');
    return nameElement.text().trim();
  }

  /**
   * Extracts the character's occupation from the page.
   *
   * @returns {Promise<string>} A promise that resolves to the character's occupation.
   */
  async _getOccupation(): Promise<string> {
    const occupationElement = this._page('div.druid-data-occupation');
    return occupationElement.text().trim() || 'Unknown';
  }

  /**
   * Extracts the character's marital status from the page.
   *
   * @returns {Promise<string>} A promise that resolves to the character's marital status.
   */
  async _getMaritalStatus(): Promise<string> {
    const maritalStatusElement = this._page('div.druid-data-marital');
    return maritalStatusElement.text().trim() || 'Unknown';
  }

  /**
   * Extracts the character's birthday season from the page.
   *
   * @returns {Promise<string>} A promise that resolves to the character's birthday season.
   */
  async _getBirthdaySeason(): Promise<string> {
    const birthdaySeasonElement = this._page('div.druid-data-birthDate');
    
    const birthday = birthdaySeasonElement.text().trim();

    if (!birthday) {
      return 'Unknown';
    }

    if (birthday.includes('Spring')) {
      return 'Spring';
    } else if (birthday.includes('Summer')) {
      return 'Summer';
    } else if (birthday.includes('Fall')) {
      return 'Fall';
    } else if (birthday.includes('Winter')) {
      return 'Winter';
    }

    return 'Unknown';
  }

  /**
   * Extracts the character's birthday day from the page.
   *
   * @returns {Promise<number>} A promise that resolves to the character's birthday day.
   */
  async _getBirthdayDay(): Promise<number> {
    const birthdaySeasonElement = this._page('div.druid-data-birthDate');
    
    const birthday = birthdaySeasonElement.text().trim();
    const NUMBER_REGEX = /(\d+)/;

    const match = birthday.match(NUMBER_REGEX);
    const dayText = match ? match[0] : '';

    if (!dayText) {
      return 1; // Default to 1 if no day is found
    }

    return parseInt(dayText, 10) || 1; // Default to 1 if parsing fails
  }

  /**
   * Extracts the character's species from the page.
   *
   * @returns {Promise<string>} A promise that resolves to the character's species.
   */
  async _getSpecies(): Promise<string> {
    const speciesElement = this._page('div.druid-data-species');
    return speciesElement.text().trim() || 'Unknown';
  }

  /**
   * Extracts the character's gender from the page.
   *
   * @returns {Promise<string>} A promise that resolves to the
   */
  async _getGender(): Promise<string> {
    const genderElement = this._page('div.druid-data-gender');
    return genderElement.text().trim() || 'Unknown';
  }

  /**
   * Extracts the character's eye color from the page.
   *
   * @returns {Promise<string>} A promise that resolves to the character's eye color.
   */
  async _getEyeColor(): Promise<string> {
    const eyeColorElement = this._page('div.druid-data-eyes');
    return eyeColorElement.text().trim() || 'Unknown';
  }

  /**
   * Extracts the character's images for different seasons.
   *
   * @returns {Promise<Record<string, string>>} A promise that resolves to an object containing image URLs.
   */
  async _getImageUrls(): Promise<Record<string, string>> {
    const imageUrls: Record<string, string> = {
      'spring-image': '',
      'summer-image': '',
      'beach-image': '',
      'fall-image': '',
      'winter-image': '',
      'icon-image': '',
    };

    const mainElement = this._page('div.druid-main-image a img');
    const mainSrc = mainElement.attr('src') || '';

    if (mainSrc) {
      imageUrls['spring-image'] = `${BASE_URL}${mainSrc}`;
    }

    const imageElements = this._page('div.druid-main-images-file a img');

    if (imageElements.length > 0) {
      for (let i = 0; i < imageElements.length; i++) {
        const src = imageElements[i].attribs?.src;
        const url = `${BASE_URL}${src}`;

        if (url.toLowerCase().includes('summer')) {
          imageUrls['summer-image'] = url;
        } else if (url.toLowerCase().includes('beach')) {
          imageUrls['beach-image'] = url;
        } else if (url.toLowerCase().includes('fall')) {
          imageUrls['fall-image'] = url;
        } else if (url.toLowerCase().includes('winter')) {
          imageUrls['winter-image'] = url;
        } else {
          imageUrls['spring-image'] = url;
        }
      }
    }

    return imageUrls;
  }

  /**
   * Checks if the character is dateable.
   *
   * @returns {Promise<boolean>} A promise that resolves to true if the character is dateable, false otherwise.
   */
  async _isDateable(name: string): Promise<boolean> {
    if (CharacterPageParser.DateableCharacters.length === 0) {
      this._getDateableCharacters();
    }

    return CharacterPageParser.DateableCharacters.includes(name.toLowerCase());
  }
  
  /**
   * Gets the small icon for the character.
   *
   * @param {string} name - The name of the character.
   * @returns {Promise<string>} A promise that resolves to the URL of the small icon.
   */
  async _getSmallIcon(name: string): Promise<string> {
    if (Object.keys(CharacterPageParser.SmallIcons).length === 0) {
      await this._getDateableCharacters();
    }

    return CharacterPageParser.SmallIcons[name.toLowerCase().replace(/\s+/g, '-')] || '';
  }


  /**
   * Extracts the dateable characters from the page.
   */
  async _getDateableCharacters(): Promise<void> {
    // Get all TR rows
    const characterTableRows = this._page('table.wikitable tbody tr');

    // Cycle through rows.
    for (let i = 0; i < characterTableRows.length; i += 1) {
      const row = characterTableRows[i];
      const cells = row.children;

      let isCharacterRow = false;
      let isDateRow = false;

      // Go through cells.
      for (let j = 0; j < cells.length; j += 1) {
        const cell = cells[j];
        
        if (cell.type === 'tag' && cell.name === 'th') {
          // Header row. We just want the TH to check if it's the dateable row.
          const children = cell.children;

          // Go through a TH's children.
          for (let k = 0; k < children.length; k += 1) {
            const child = children[k];

            // If it's an A tag.
            if (child.type === 'tag' && child.name === 'a') {
              const texts = child.children;

              if (texts[0].type === 'text') {
                if ([
                  'Bachelorettes',
                  'Bachelors',
                ].includes(texts[0].data)) {
                  isDateRow = true;
                  isCharacterRow = true;
                } else if ([
                  'Townsfolk',
                  'Vendors',
                  'Special',
                ].includes(texts[0].data)) {
                  isCharacterRow = true;
                }
              }
            }
          }
        } else if (cell.type === 'tag' && cell.name === 'td' && isCharacterRow) {
          // If it's a TD, we want to check the names.
          const children = cell.children;

          for (let k = 0; k < children.length; k += 1) {
            const child = children[k];

            if (child.type === 'tag' && child.name === 'a') {
              const texts = child.children;
              const name = child.attribs?.title?.trim();

              if (texts[0].type === 'text' && isDateRow) {
                CharacterPageParser.DateableCharacters.push(texts[0].data.toLowerCase().replace(/\s+/g, '-'));
              } else if (texts[0].type === 'tag' && texts[0].name === 'img') {
                CharacterPageParser.SmallIcons[name.toLowerCase().replace(/\s+/g, '-')] = `${BASE_URL}${texts[0].attribs?.src}`;
              }
            }
          }
        }
      }
    }
  }

  /**
   * Extracts the character's relationships from the page.
   *
   * @returns {Promise<CharacterRelation[]>} A promise that resolves to an array of character relationships.
   */
  async _getRelationships(): Promise<CharacterRelation[]> {
    const relationships: CharacterRelation[] = [];

    const relationWrapper = this._page('div.druid-data-relatives');
    const relationData = relationWrapper.contents();

    let name = '';
    let type = '' as CharacterRelationType;

    for (let i = 0; i < relationData.length; i++) {
      const relationElement = relationData[i];

      if (relationElement.type === 'tag' && relationElement.name === 'br') {
        if (name && type) {
          relationships.push({
            id: name.toLowerCase().replace(/\s+/g, '-'),
            type,
          });
        }

        name = '';
        type = '' as CharacterRelationType;
      } else if (relationElement.type === 'text') {
        const data = relationElement.data.trim();
        const parts = data.split(':');

        type = parts[0] as CharacterRelationType;

        if (parts.length > 1) {
          name = parts[1].trim();
        }
      } else if (relationElement.type === 'tag' && relationElement.name === 'a') {
        name = relationElement.attribs?.title || '';
      }
    }

    if (name && type) {
      relationships.push({
        id: name.toLowerCase().replace(/\s+/g, '-'),
        type,
      });
    }

    return relationships;
  }

  // async _getLovedGifts(): Promise<string[]> {
  //   const lovedGifts: string[] = [];

  //   return lovedGifts;
  // }

  // async _getLikedGifts(): Promise<string[]> {
  //   const likedGifts: string[] = [];

  //   return likedGifts;
  // }

  // async _getDislikedGifts(): Promise<string[]> {
  //   const dislikedGifts: string[] = [];

  //   return dislikedGifts;
  // }


  // async _getHatedGifts(): Promise<string[]> {
  //   const hatedGifts: string[] = [];

  //   return hatedGifts;
  // }

  // async _getQuests(): Promise<string[]> {
  //   const quests: string[] = [];

  //   return quests;
  // }

  // async _getRequests(): Promise<string[]> {
  //   const requests: string[] = [];

  //   return requests;
  // }
}
