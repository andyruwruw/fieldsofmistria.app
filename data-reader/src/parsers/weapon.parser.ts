// Local Imports
import { convertTesseraeString } from '../utils/convert';
import { BASE_URL } from '../config';
import { Parser } from './parser';

// Types
import {
  Weapon,
  WeaponIngredient,
} from '../models/weapons';

/**
 * Parses a specific weapon page.
 */
export class WeaponPageParser extends Parser<Weapon> {
  /**
   * Parses the HTML page and returns structured data.
   *
   * @returns {Promise<Weapon>} A promise that resolves to the parsed data.
   */
  async parse(): Promise<Weapon> {
    const name = this._getText('aside.portable-infobox h2.pi-title') || 'Unknown Weapon';
    const type = this._dataValueText('type').toLowerCase() || 'sword';
    const source = this._dataValueText('sources');

    return {
      id: name.toLowerCase().replace(/\s+/g, '-'),
      name,
      description: this._getText('aside.portable-infobox figcaption.pi-caption'),
      image: this._getImage(),
      type,
      tier: this._getTier(
        name,
        type,
      ),
      attack: parseInt(this._dataValueText('attack').replace(/\D/g, ''), 10) || 0,
      sell: convertTesseraeString(this._dataValueText('sellValue')),
      source,
      ingredients: this._getIngredients(),
      'crafting-station': this._dataValueText('craftingstation'),
      'craft-time': this._getCraftTime(),
      'skill-level': parseInt(this._dataValueText('skillLevel').replace(/\D/g, ''), 10) || 0,
      price: convertTesseraeString(
        source,
        0,
      ),
      href: this._url,
    };
  }

  /**
   * Gets the trimmed, normalized text of a `.pi-data-value` element by its
   * `data-source` attribute within the weapon's infobox.
   *
   * @param {string} source The `data-source` attribute to look up.
   * @returns {string} The normalized text content.
   */
  _dataValueText(source: string): string {
    const value = this._getFirst(`aside.portable-infobox [data-source="${source}"] .pi-data-value`).clone();

    value.find('span[style*="display:none"]').remove();
    value.find('br').replaceWith(' ');

    return value.text().replace(/\s+/g, ' ').trim();
  }

  /**
   * Extracts the weapon's main infobox image.
   *
   * @returns {string} The full URL of the weapon's image.
   */
  _getImage(): string {
    const src = this._getFirst('aside.portable-infobox figure.pi-image img').attr('src');

    return src ? `${BASE_URL}${src}` : '';
  }

  /**
   * Derives the weapon's tier from its name by stripping the weapon type
   * suffix (e.g. "Copper Sword" -> "copper", "Scrap Metal Sword" -> "scrap-metal").
   *
   * @param {string} name The weapon's full name.
   * @param {string} type The weapon's type (e.g. "sword").
   * @returns {string} The slugified tier.
   */
  _getTier(
    name: string,
    type: string,
  ): string {
    const stripped = name.replace(new RegExp(`\\s*${type}$`, 'i'), '').trim();

    return stripped.toLowerCase().replace(/\s+/g, '-') || 'unknown';
  }

  /**
   * Extracts the crafting ingredients from the Recipe section, if present.
   *
   * @returns {WeaponIngredient[]} The list of crafting ingredients.
   */
  _getIngredients(): WeaponIngredient[] {
    const value = this._getFirst('aside.portable-infobox [data-source="ingredients"] .pi-data-value');

    if (!value || value.length === 0) {
      return [];
    }

    const ingredients: WeaponIngredient[] = [];
    let pendingImage = '';
    let pendingName = '';

    const contents = value.contents().toArray();

    for (let i = 0; i < contents.length; i += 1) {
      const node = contents[i] as any;

      if (node.type === 'tag' && node.name === 'a') {
        const link = this._page(node);
        const img = link.find('img');

        if (img.length) {
          const src = img.attr('src');
          pendingImage = src ? `${BASE_URL}${src}` : pendingImage;
        }

        const text = link.text().trim();

        if (text) {
          pendingName = text;
        }
      } else if (node.type === 'text') {
        const match = (node.data || '').match(/\((\d+)\)/);

        if (match && pendingName) {
          ingredients.push({
            id: pendingName.toLowerCase().replace(/\s+/g, '-'),
            name: pendingName,
            quantity: parseInt(match[1], 10),
            image: pendingImage,
          });

          pendingName = '';
          pendingImage = '';
        }
      }
    }

    return ingredients;
  }

  /**
   * Extracts the base crafting time (excluding skill-perk variants) in minutes.
   *
   * @returns {number} The crafting time in minutes.
   */
  _getCraftTime(): number {
    const text = this._getFirst('aside.portable-infobox [data-source="craftTime"] .pi-data-value span.no-wrap')
      .first()
      .text()
      .replace(/\s+/g, ' ')
      .trim();

    if (!text) {
      return 0;
    }

    return this._timeToMinutes(text);
  }
}
