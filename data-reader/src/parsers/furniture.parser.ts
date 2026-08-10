// Local Imports
import { convertTesseraeString } from '../utils/convert';
import { BASE_URL } from '../config';
import { Parser } from './parser';

// Types
import {
  Furniture,
  FurnitureIngredient,
  FurnitureVariant,
} from '../models/furniture';

/**
 * Infobox field keys that are already mapped onto explicit `Furniture` fields,
 * used to keep `_getExtraFields` from duplicating them.
 */
const KNOWN_FIELDS = new Set([
  'source',
  'furnitureSet',
  'furnitureCategory',
  'furnitureSubCategory',
  'sellValue',
  'coins',
  'recipeSource',
  'ingredients',
  'craftTime',
  'craftingLevel',
]);

/**
 * Parses a furniture item page. Furniture pages come in two infobox flavors:
 * newer, craftable items use `div.druid-infobox`, while a handful of simpler
 * items (mostly non-craftable decorations) still use the older
 * `aside.portable-infobox`. Both share the same underlying field names
 * (`source`, `furnitureSet`, `furnitureCategory`, `sellValue`, `ingredients`, etc.),
 * just under different markup, so every field lookup below checks both.
 */
export class FurniturePageParser extends Parser<Furniture> {
  /**
   * Parses the HTML page and returns structured data.
   *
   * @returns {Promise<Furniture>} A promise that resolves to the parsed data.
   */
  async parse(): Promise<Furniture> {
    const name = this._getText('span.mw-page-title-main') || 'Unknown Furniture';
    const id = name.toLowerCase().replace(/\s+/g, '-').trim();

    const variants = this._getVariants();
    const craftTimeText = this._fieldText(this._row('craftTime'));
    const craftingLevelText = this._fieldText(this._row('craftingLevel'));

    return {
      id,
      name,
      description: variants[0]?.description || '',
      image: variants[0]?.image || '',
      category: this._lastAnchorText(this._dataEl('furnitureCategory')),
      subcategory: this._lastAnchorText(this._dataEl('furnitureSubCategory')),
      set: this._lastAnchorText(this._dataEl('furnitureSet')),
      sell: variants[0]?.sell || 0,
      sources: this._parseSources(this._dataEl('source')),
      recipeSource: this._fieldText(this._row('recipeSource')),
      ingredients: this._parseIngredients(this._dataEl('ingredients')),
      craftTime: craftTimeText ? this._timeToMinutes(craftTimeText) : 0,
      craftingLevel: parseInt(craftingLevelText.replace(/\D/g, ''), 10) || 0,
      variants,
      extra: this._getExtraFields(),
      href: this._url,
    };
  }

  /**
   * Whether this page uses the newer druid-infobox markup, as opposed to the
   * older portable-infobox markup.
   *
   * @returns {boolean} True if this page uses the druid-infobox format.
   */
  private _isDruid(): boolean {
    return this._get('div.druid-infobox').length > 0;
  }

  /**
   * Finds the "row" element for a given infobox field, checking both the
   * druid-infobox and portable-infobox markup.
   *
   * @param {string} field The field's key (e.g. `sellValue`, `furnitureCategory`).
   * @returns {any} The row element, or an empty selection if not found.
   */
  private _row(field: string): any {
    const druidRow = this._get(`.druid-row-${field}`);

    if (druidRow.length > 0) {
      return druidRow;
    }

    return this._get(`[data-source="${field}"]`);
  }

  /**
   * Finds the "data" element (the value, without its label) for a given
   * infobox field.
   *
   * @param {string} field The field's key (e.g. `sellValue`, `furnitureCategory`).
   * @returns {any} The data element, or an empty selection if not found.
   */
  private _dataEl(field: string): any {
    const row = this._row(field);

    if (row.length === 0) {
      return row;
    }

    const data = row.find('.druid-data, .pi-data-value').first();

    return data.length > 0 ? data : row;
  }

  /**
   * Cleans an infobox value element down to plain text, stripping out
   * hidden sort-order spans that `cheerio` doesn't otherwise respect.
   *
   * @param {any} el The element to clean.
   * @returns {string} The cleaned, trimmed text.
   */
  private _cleanText(el: any): string {
    if (!el || el.length === 0) {
      return '';
    }

    const clone = el.clone();

    clone.find('span[style*="display: none"], span[style*="display:none"]').remove();
    clone.find('br').each((_i: number, br: any) => {
      this._page(br).replaceWith(' ');
    });

    return clone.text().replace(/\s+/g, ' ').trim();
  }

  /**
   * Gets the text of an infobox field's row, resolving to a single value even
   * when the field is toggleable per-variant (in which case the currently
   * focused variant's value is used as the representative value).
   *
   * @param {any} row The field's row element.
   * @returns {string} The field's text.
   */
  private _fieldText(row: any): string {
    if (!row || row.length === 0) {
      return '';
    }

    const data = row.find('.druid-data, .pi-data-value').first();
    const target = data.length > 0 ? data : row;
    const toggleable = target.find('> .druid-toggleable-data');

    if (toggleable.length > 0) {
      const focused = toggleable.filter('.focused').first();

      return this._cleanText(focused.length > 0 ? focused : toggleable.first());
    }

    return this._cleanText(target);
  }

  /**
   * Gets the text of the last non-empty anchor within an infobox value
   * element, which for category/set-style fields holds the real label
   * (the first anchor usually just wraps an icon).
   *
   * @param {any} el The infobox value element.
   * @returns {string} The last anchor's text, or the cleaned element text if none is found.
   */
  private _lastAnchorText(el: any): string {
    if (!el || el.length === 0) {
      return '';
    }

    const anchors = el.find('a').filter((_i: number, a: any) => (this._page(a).text().trim() !== ''));

    if (anchors.length === 0) {
      return this._cleanText(el);
    }

    return this._page(anchors.get(anchors.length - 1)).text().trim();
  }

  /**
   * Parses a "Sources" infobox field into a list of source names
   * (e.g. `["Woodcrafting", "Merri's Stall"]`).
   *
   * @param {any} el The infobox value element.
   * @returns {string[]} The list of source names.
   */
  private _parseSources(el: any): string[] {
    if (!el || el.length === 0) {
      return [];
    }

    const sources: string[] = [];

    el.find('a').each((_i: number, a: any) => {
      const anchor = this._page(a);

      if (anchor.find('img').length > 0) {
        return;
      }

      const text = anchor.text().trim();

      if (text && !sources.includes(text)) {
        sources.push(text);
      }
    });

    return sources;
  }

  /**
   * Parses an "Ingredients" infobox field into a list of structured
   * ingredients, pairing each ingredient link with the quantity that
   * follows it in parentheses.
   *
   * @param {any} el The infobox value element.
   * @returns {FurnitureIngredient[]} The list of ingredients.
   */
  private _parseIngredients(el: any): FurnitureIngredient[] {
    if (!el || el.length === 0) {
      return [];
    }

    const ingredients: FurnitureIngredient[] = [];
    let current: FurnitureIngredient | null = null;

    el.contents().each((_i: number, node: any) => {
      if (node.type === 'tag' && node.name === 'a') {
        const anchor = this._page(node);

        if (anchor.find('img').length > 0) {
          return;
        }

        const name = anchor.text().trim();

        if (!name) {
          return;
        }

        current = {
          id: name.toLowerCase().replace(/\s+/g, '-').trim(),
          name,
          href: `${BASE_URL}${node.attribs.href || ''}`,
          quantity: 1,
        };

        ingredients.push(current);
      } else if (node.type === 'text' && current) {
        const match = (node.data || '').match(/\((\d+)\)/);

        if (match) {
          (current as FurnitureIngredient).quantity = parseInt(match[1], 10);
        }
      }
    });

    return ingredients;
  }

  /**
   * Gets the sell price for a non-toggleable "Sell Price" field.
   *
   * @returns {number} The sell price, in tesserae.
   */
  private _getSingleSell(): number {
    return convertTesseraeString(this._fieldText(this._row('sellValue')));
  }

  /**
   * Builds a map of variant label -> sell price, for items whose sell price
   * differs per color variant (rendered as a toggleable `druid-row-coins` field).
   *
   * @returns {Map<string, number>} The map of variant label to sell price.
   */
  private _toggleSellMap(): Map<string, number> {
    const map = new Map<string, number>();

    this._get('.druid-row-coins .druid-toggleable-data').each((_i: number, el: any) => {
      const data = this._page(el);
      const label = data.attr('data-druid-from-tab') || '';

      if (label) {
        map.set(label, convertTesseraeString(data.text().trim()));
      }
    });

    return map;
  }

  /**
   * Gets the item's color/style variants, along with their images, captions
   * and (when they differ per-variant) sell prices.
   *
   * @returns {FurnitureVariant[]} The item's variants.
   */
  private _getVariants(): FurnitureVariant[] {
    if (this._isDruid()) {
      return this._getDruidVariants();
    }

    return this._getPortableVariant();
  }

  /**
   * Gets the item's variants from druid-infobox markup.
   *
   * @returns {FurnitureVariant[]} The item's variants.
   */
  private _getDruidVariants(): FurnitureVariant[] {
    const variants: FurnitureVariant[] = [];
    const sellMap = this._toggleSellMap();
    const singleSell = sellMap.size === 0 ? this._getSingleSell() : 0;

    this._get('.druid-main-images-file').each((_i: number, el: any) => {
      const file = this._page(el);
      const dataDruid = file.attr('data-druid') || '';
      const label = this._get(`.druid-main-images-label[data-druid="${dataDruid}"]`).text().trim();
      const img = file.find('img').first();
      const titleEl = this._get(`.druid-title .druid-toggleable-data[data-druid="${dataDruid}"]`);

      variants.push({
        label,
        name: titleEl.length > 0 ? this._cleanText(titleEl) : label,
        image: img.attr('src') ? `${BASE_URL}${img.attr('src')}` : '',
        description: file.find('.druid-main-images-caption').text().trim(),
        sell: sellMap.has(label) ? sellMap.get(label) as number : singleSell,
      });
    });

    if (variants.length > 0) {
      return variants;
    }

    const img = this._get('.druid-main-images img').first();

    return [{
      label: '',
      name: this._getText('span.mw-page-title-main'),
      image: img.attr('src') ? `${BASE_URL}${img.attr('src')}` : '',
      description: this._get('.druid-main-images-caption').first().text().trim(),
      sell: this._getSingleSell(),
    }];
  }

  /**
   * Gets the item's single, non-variant "variant" from portable-infobox markup.
   *
   * @returns {FurnitureVariant[]} The item's (single) variant.
   */
  private _getPortableVariant(): FurnitureVariant[] {
    const figure = this._getFirst('aside.portable-infobox figure.pi-image');
    const img = figure.find('img').first();

    return [{
      label: '',
      name: this._getText('span.mw-page-title-main'),
      image: img.attr('src') ? `${BASE_URL}${img.attr('src')}` : '',
      description: figure.find('figcaption').text().trim(),
      sell: this._getSingleSell(),
    }];
  }

  /**
   * Captures any infobox fields not already mapped onto explicit `Furniture`
   * fields (e.g. "Storage Capacity" on chests), keyed by their display label.
   *
   * @returns {Record<string, string>} The extra fields.
   */
  private _getExtraFields(): Record<string, string> {
    const extra: Record<string, string> = {};

    this._get('.druid-row').each((_i: number, row: any) => {
      const element = this._page(row);
      const rowClass = (element.attr('class') || '')
        .split(' ')
        .find((cls: string) => (cls.startsWith('druid-row-') && cls !== 'druid-row'));
      const key = rowClass ? rowClass.replace('druid-row-', '') : '';

      if (!key || KNOWN_FIELDS.has(key)) {
        return;
      }

      const label = element.find('.druid-label').first().text().trim();
      const text = this._fieldText(element);

      if (label && text) {
        extra[label] = text;
      }
    });

    this._get('aside.portable-infobox [data-source]').each((_i: number, el: any) => {
      const element = this._page(el);
      const key = element.attr('data-source') || '';

      if (!key || key === 'name' || key === 'image' || KNOWN_FIELDS.has(key)) {
        return;
      }

      const label = element.find('h3.pi-data-label').first().text().trim();
      const text = this._cleanText(element.find('.pi-data-value').first());

      if (label && text) {
        extra[label] = text;
      }
    });

    return extra;
  }
}
