// Local Imports
import { convertTesseraeString } from '../utils/convert';
import { BASE_URL } from '../config';
import { Parser } from './parser';

// Types
import { EquipmentType } from '../models/tools';
import {
  Equipment,
  EquipmentIngredient,
} from '../models/equipment';

/**
 * Matches the equipment slot suffix on a piece of equipment's name to its
 * `EquipmentType`. The wiki uses different words for the same slot across
 * different tiers (e.g. "Armor" / "Chestpiece" / "Cuirass" all mean
 * chestpiece), so each slot is matched against every synonym seen in the
 * equipment list.
 */
const TYPE_PATTERNS: [ RegExp, EquipmentType ][] = [
  [ /Helmet$/i, 'helmet' ],
  [ /(Chestpiece|Armor|Cuirass)$/i, 'chestpiece' ],
  [ /(Pants|Legplates|Cuisses|Tassets)$/i, 'pants' ],
  [ /(Shoes|Greaves|Boots)$/i, 'shoes' ],
  [ /(Ring|Wristband)$/i, 'ring' ],
];

/**
 * Parses a specific piece of equipment's page.
 */
export class EquipmentPageParser extends Parser<Equipment> {
  /**
   * Parses the HTML page and returns structured data.
   *
   * @returns {Promise<Equipment>} A promise that resolves to the parsed data.
   */
  async parse(): Promise<Equipment> {
    const name = this._getText('aside.portable-infobox h2.pi-title') || 'Unknown Equipment';
    const type = this._getType(name);
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
      defense: parseInt(this._dataValueText('defense').replace(/\D/g, ''), 10) || 0,
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
   * `data-source` attribute within the equipment's infobox.
   *
   * @param {string} source The `data-source` attribute to look up.
   * @returns {string} The normalized text content.
   */
  _dataValueText(source: string): string {
    return this._getText(`aside.portable-infobox [data-source="${source}"] .pi-data-value`).replace(/\s+/g, ' ').trim();
  }

  /**
   * Extracts the equipment's main infobox image.
   *
   * @returns {string} The full URL of the equipment's image.
   */
  _getImage(): string {
    const src = this._getFirst('aside.portable-infobox figure.pi-image img').attr('src');

    return src ? `${BASE_URL}${src}` : '';
  }

  /**
   * Derives the equipment's slot type (helmet/chestpiece/pants/shoes/ring)
   * from its name. The infobox's own "Type" field only distinguishes
   * "Armor" vs "Ring", not the specific slot.
   *
   * @param {string} name The equipment's full name.
   * @returns {EquipmentType} The equipment's slot type.
   */
  _getType(name: string): EquipmentType {
    for (const [ pattern, type ] of TYPE_PATTERNS) {
      if (pattern.test(name)) {
        return type;
      }
    }

    return 'chestpiece';
  }

  /**
   * Derives the equipment's tier from its name by stripping the slot
   * suffix (e.g. "Copper Ring" -> "copper", "Scrap Metal Boots" -> "scrap-metal").
   *
   * @param {string} name The equipment's full name.
   * @param {EquipmentType} type The equipment's slot type.
   * @returns {string} The slugified tier.
   */
  _getTier(
    name: string,
    type: EquipmentType,
  ): string {
    const entry = TYPE_PATTERNS.find(([ , t ]) => (t === type));

    if (!entry) {
      return 'unknown';
    }

    const stripped = name.replace(entry[0], '').trim();

    return stripped.toLowerCase().replace(/\s+/g, '-') || 'unknown';
  }

  /**
   * Extracts the crafting ingredients from the Recipe section, if present.
   *
   * @returns {EquipmentIngredient[]} The list of crafting ingredients.
   */
  _getIngredients(): EquipmentIngredient[] {
    const value = this._getFirst('aside.portable-infobox [data-source="ingredients"] .pi-data-value');

    if (!value || value.length === 0) {
      return [];
    }

    const ingredients: EquipmentIngredient[] = [];
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
