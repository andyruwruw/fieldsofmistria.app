// Packages
import { CheerioAPI } from 'cheerio';

// Local Imports
import { convertTesseraeString } from '../utils/convert';
import { MonsterListRow } from './monster-list.parser';
import { Parser } from './parser';

// Types
import { Monster, MonsterType } from '../models/monsters';

/**
 * Escapes a string for use inside a `RegExp`.
 *
 * @param {string} value The string to escape.
 * @returns {string} The escaped string.
 */
const escapeRegex = (value: string): string => (value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));

/**
 * Parses a monster detail page to extract monster information.
 *
 * Monster detail pages (e.g. `/wiki/Sapling`, `/wiki/Clod`, `/wiki/Flame_Spirit`)
 * use a `div.druid-infobox` that carries every color/variant of that monster
 * type as tabs (`data-druid-from-tab`) within the same page. A single detail
 * page can therefore back multiple `Monster` entries from the list page (e.g.
 * every Rock Clod and Ore Clod color links to the same `/wiki/Clod` page), so
 * this parser is constructed with the specific `MonsterListRow` it should
 * extract stats for, in addition to the already-fetched page.
 */
export class MonsterPageParser extends Parser<Monster> {
  /**
   * The list-page row (name/type/biome/drops/etc.) this instance extracts stats for.
   */
  private _row: MonsterListRow;

  /**
   * Constructs a new MonsterPageParser instance.
   *
   * @param {string} url The URL of the page being parsed.
   * @param {CheerioAPI} page The Cheerio instance representing the HTML page to parse.
   * @param {MonsterListRow} row The list-page row this instance extracts stats for.
   */
  constructor(
    url: string,
    page: CheerioAPI,
    row: MonsterListRow,
  ) {
    super(url, page);

    this._row = row;
  }

  /**
   * Parses the HTML page and returns structured data.
   *
   * @returns {Promise<Monster>} A promise that resolves to the parsed data.
   */
  async parse(): Promise<Monster> {
    const health = this._getStatValue('hp');
    const damage = this._getStatValue('dmg');
    const essense = this._getStatValue('essence');
    const tesserae = this._getStatValue('coins', true);

    return {
      id: this._row.id,
      name: this._row.name,
      description: this._getDescription(),
      image: this._row.icon,
      biome: this._row.biome,
      'lowest-floor': this._row['lowest-floor'],
      'highest-floor': this._row['highest-floor'],
      drops: this._row.drops,
      type: this._row.type as MonsterType,
      health,
      damage,
      essense,
      tesserae,
    };
  }

  /**
   * Extracts the page's description from the first non-empty paragraph of
   * the article body.
   *
   * @returns {string} The monster's description.
   */
  private _getDescription(): string {
    const paragraphs = this._get('#mw-content-text .mw-parser-output > p');

    for (let i = 0; i < paragraphs.length; i += 1) {
      // Paragraphs can contain hidden `<span style="display:none">` sort-key
      // digits (the same pattern used in the list page's biome cells), so
      // strip those out before reading the text.
      const clone = this._page(paragraphs[i]).clone();
      clone.find('[style*="display:none"]').remove();
      const text = clone.text().trim();

      if (text) {
        return text;
      }
    }

    return '';
  }

  /**
   * Extracts a numeric stat (Health, Damage, Essence or Tesserae) from the
   * `div.druid-infobox`'s tabbed Stats/Drops sections, matched to this
   * instance's variant.
   *
   * @param {string} field The druid grid item suffix (`hp`, `dmg`, `essence`, `coins`).
   * @param {boolean} [isTesserae=false] Whether to parse the value as a tesserae string (e.g. "5t").
   * @returns {number} The parsed stat value, or 0 if not found.
   */
  private _getStatValue(
    field: string,
    isTesserae = false,
  ): number {
    const nodes = this._get(`.druid-grid-item-${field} .druid-toggleable-data`);
    const values = {} as Record<string, string>;

    for (let i = 0; i < nodes.length; i += 1) {
      const node = this._page(nodes[i]);
      const tab = node.attr('data-druid-from-tab');

      if (tab) {
        values[tab] = node.text().trim();
      }
    }

    const key = this._matchVariantKey(Object.keys(values));

    if (!key) {
      return 0;
    }

    const text = values[key];

    return isTesserae ? convertTesseraeString(text) : (parseInt(text, 10) || 0);
  }

  /**
   * Matches this instance's row variant (e.g. "Cool", "Copper", "Purple
   * Flame Spirit") against the tab keys found in the druid-infobox, trying
   * several strategies since the list page and the detail page don't always
   * name variants identically (e.g. the list page names the base Rock Clod
   * variant "Rock", but the detail page's default tab is named "Clod").
   *
   * @param {string[]} keys The tab keys (`data-druid-from-tab` values) available on the page.
   * @returns {string | undefined} The matching key, if any.
   */
  private _matchVariantKey(keys: string[]): string | undefined {
    const normalize = (value: string): string => (value.toLowerCase().replace(/\s*\(.*?\)\s*/g, ' ').replace(/\s+/g, ' ').trim());

    const variant = normalize(this._row.variant);
    const type = normalize(this._row.type);
    const typeWords = type.split(' ');
    const lastTypeWord = typeWords[typeWords.length - 1];

    const normalizedKeys = keys.map((key: string) => ({
      key,
      normalized: normalize(key),
    }));

    let found = normalizedKeys.find((entry) => (entry.normalized === variant));

    if (found) {
      return found.key;
    }

    const strippedFull = variant.replace(new RegExp(`\\s*${escapeRegex(type)}$`), '').trim();

    found = normalizedKeys.find((entry) => (entry.normalized === strippedFull));

    if (found) {
      return found.key;
    }

    const strippedLast = variant.replace(new RegExp(`\\s*${escapeRegex(lastTypeWord)}$`), '').trim();

    found = normalizedKeys.find((entry) => (entry.normalized === strippedLast));

    if (found) {
      return found.key;
    }

    // Fallback: some category tables name their base/default variant after a
    // color (e.g. the Mushrooms table's base row is "Red") while the detail
    // page's default tab is named after the type instead (e.g. "Mushroom").
    // If nothing else matched, prefer that default tab.
    found = normalizedKeys.find((entry) => (entry.normalized === lastTypeWord))
      || normalizedKeys.find((entry) => (entry.normalized === type));

    if (found) {
      return found.key;
    }

    return undefined;
  }
}
