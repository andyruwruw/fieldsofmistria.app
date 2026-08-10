// Local Imports
import { BASE_URL } from '../config';
import { ToolListParser } from './tool-list.parser';
import { Parser } from './parser';

// Types
import { Tool, ToolIngredient } from '../models/tools';

/**
 * Parses a single tool page (e.g. "Copper Pickaxe") to extract its data.
 *
 * Most fields (name, description, image, sell price, recipe) come from the
 * page's `aside.portable-infobox`. The charge/cast range, tesserae cost, and
 * a human-readable source description come from `ToolListParser`'s cached
 * data since `_parseAside()` intentionally drops the "Sources" field.
 */
export class ToolPageParser extends Parser<Tool> {
  /**
   * Parses the HTML page and returns structured data.
   *
   * @returns {Promise<Tool>} A promise that resolves to the parsed data.
   */
  async parse(): Promise<Tool> {
    const data = await this._parseAside();

    const name = data.name || 'Unknown Tool';
    const id = name.toLowerCase().replace(/\s+/g, '-').trim();

    const listData = ToolListParser._data[id] || {};
    const ingredient = this._getIngredient(data);

    return {
      id,
      name,
      description: data.description || '',
      image: data.image || '',
      type: listData.type as Tool['type'],
      tier: listData.tier as Tool['tier'],
      chargeRange: ToolListParser.getChargeRange(id),
      sell: data.sell || 0,
      cost: ToolListParser.getCost(id),
      craftable: !!ingredient,
      ingredient,
      craftingStation: data.Equipment?.text || undefined,
      craftTime: data['Crafting Time']?.text ? this._timeToMinutes(data['Crafting Time'].text) : undefined,
      craftingLevel: data['Skill Level']?.text ? parseInt(data['Skill Level'].text, 10) : undefined,
      source: ToolListParser.getSource(id),
      href: this._url,
    };
  }

  /**
   * Extracts the crafting ingredient from the parsed aside data.
   *
   * @param {Record<string, any>} data The parsed aside data.
   * @returns {ToolIngredient | undefined} The tool's crafting ingredient, if any.
   */
  _getIngredient(data: Record<string, any>): ToolIngredient | undefined {
    const ingredients = data.Ingredients;

    if (!ingredients || !ingredients.href) {
      return undefined;
    }

    const text = ingredients.text instanceof Array ? ingredients.text : [ ingredients.text ];
    const name = text.find((t: string) => (!!t && !t.startsWith('('))) || '';
    const quantityText = text.find((t: string) => (!!t && t.startsWith('(')));
    const quantity = quantityText ? parseInt(quantityText.replace(/[()]/g, ''), 10) : 1;

    return {
      id: name.toLowerCase().replace(/\s+/g, '-').trim(),
      name,
      image: ingredients.src ? (ingredients.src.startsWith('http') ? ingredients.src : `${BASE_URL}${ingredients.src}`) : '',
      quantity: quantity || 1,
    };
  }
}
