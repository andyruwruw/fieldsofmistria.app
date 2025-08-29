// Local Imports
import { Parser } from './parser';

// Types
import {
  Dish,
  DishIngredient,
} from '../models/dishes';

/**
 * Parses a dish page to extract dish information.
 */
export class DishPageParser extends Parser<Dish> {
  protected _data: Record<string, any> = {};

  /**
   * Parses the HTML page and returns structured data.
   *
   * @returns {Promise<Dish>} A promise that resolves to the parsed data.
   */
  async parse(): Promise<Dish> {
    try {
      this._data = await this._parseAside();

      // Implement the parsing logic to extract dish information from the data
      return {
        id: this._getId(),
        name: this._getName(),
        description: this._getDescription(),
        health: this._getHealth(),
        stamina: this._getStamina(),
        category: this._getCategory(),
        subCategory: this._getSubCategory(),
        sell: this._data.sell,
        ingredients: this._getIngredients(),
        time: this._getTime(),
        stars: this._getStars(),
        level: this._getLevel(),
        tier: this._getTier(),
        source: this._getSource(),
        image: this._data.image,
        href: this._url,
      } as unknown as Dish;
    } catch (error) {
      console.log(this._data);
      console.log(error);
    }

    return {
    } as Dish;
  }

  /**
   * Gets the ingredients of the dish.
   *
   * @returns {DishIngredient[]} The ingredients of the dish.
   */
  protected _getIngredients(): DishIngredient[] {
    const ingredients: DishIngredient[] = [];

    if (!('Ingredients' in this._data) || !Array.isArray(this._data.Ingredients.text)) {
      return ingredients;
    }

    for (let i = 0; i < this._data.Ingredients.text.length; i += 2) {
      ingredients.push({ 
        id: this._data.Ingredients.text[i].toLowerCase().replace(/\s+/g, '-'),
        amount: parseInt(this._data.Ingredients.text[i + 1].replace(/[\(\)]+/g, '').trim()),
      });
    }

    return ingredients;
  }

  /**
   * Gets the source of the dish.
   *
   * @returns {string} The source of the dish.
   */
  protected _getSource(): string {
    if ('Recipe Source' in this._data) {
      return this._data['Recipe Source'].text instanceof Array ? this._data['Recipe Source'].text.join(' ') : this._data['Recipe Source'].text
    }

    return '';
  }

  /**
   * Gets the star rating of the dish.
   *
   * @returns {number} The star rating of the dish.
   */
  protected _getStars(): number {
    if ('Stars' in this._data) {
      return parseInt(this._data.Stars.text) || 0;
    }

    return 0;
  }

  /**
   * Gets the skill level of the dish.
   *
   * @returns {number} The skill level of the dish.
   */
  protected _getLevel(): number {
    if ('Skill Level' in this._data) {
      return parseInt(this._data['Skill Level'].text) || 0;
    }

    return 0;
  }

  /**
   * Gets the kitchen tier of the dish.
   *
   * @returns {number} The kitchen tier of the dish.
   */
  protected _getTier(): number {
    if ('Kitchen Tier' in this._data) {
      return parseInt(this._data['Kitchen Tier'].text) || 0;
    }

    return 0;
  }

  /**
   * Gets the ID of the dish.
   *
   * @returns {string} The ID of the dish.
   */
  
  protected _getId(): string {
    return this._data.name.trim().replace(/\s+/g, '-').toLowerCase() || '';
  }

  /**
   * Gets the name of the dish.
   *
   * @returns {string} The name of the dish.
   */
  protected _getName(): string {
    return this._data.name || '';
  }

  /**
   * Gets the description of the dish.
   *
   * @returns {string} The description of the dish.
   */
  protected _getDescription(): string {
    return this._data.description || '';
  }

  /**
   * Gets the health of the dish.
   *
   * @returns {number} The health of the dish.
   */
  protected _getHealth(): number {
    return this._data.health || 0;
  }

  /**
   * Gets the stamina of the dish.
   *
   * @returns {number} The stamina of the dish.
   */
  protected _getStamina(): number {
    return this._data.stamina || 0;
  }

  /**
   * Gets the category of the dish.
   *
   * @returns {string} The category of the dish.
   */
  protected _getCategory(): string {
    if (!('Dish Category' in this._data)) {
      return '';
    }

    if (this._data['Dish Category'].text instanceof Array) {
      return this._data['Dish Category'].text[0];
    }

    return this._data['Dish Category'].text || '';
  }

  /**
   * Gets the sub-category of the dish.
   *
   * @returns {string} The sub-category of the dish.
   */
  protected _getSubCategory(): string {
    if ('Dish Category' in this._data
      && this._data['Dish Category'].text instanceof Array
      && this._data['Dish Category'].text.length > 2) {
      return this._data['Dish Category'].text[2];
    }

    return '';
  }

  /**
   * Gets the crafting time of the dish.
   *
   * @returns {number} The crafting time of the dish in minutes.
   */
  protected _getTime(): number {
    if ('Crafting Time' in this._data) {
      return this._timeToMinutes(this._data['Crafting Time'].text);
    }

    return 0;
  }
}
