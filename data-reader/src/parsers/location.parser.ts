// Local Imports
import { BASE_URL } from '../config';
import { Parser } from './parser';

// Types
import {
  Location,
  LocationImage,
  LocationLink,
  LocationRequirement,
  LocationResident,
} from '../models/locations';

/**
 * Converts a display name into the repo's slug-id convention.
 *
 * @param {string} name - The display name to slugify.
 * @returns {string} The slugified id.
 */
const toId = (name: string): string => name.trim().toLowerCase().replace(/\s+/g, '-');

/**
 * The infobox row fields captured under their own dedicated `Location`
 * property, rather than falling into `extra`.
 */
const KNOWN_FIELDS = new Set([
  'location',
  'type',
  'residents',
  'unlock',
  'upgrade',
  'theme',
]);

/**
 * Parses an individual location page's `div.druid-infobox`, whose rows
 * carry stable `druid-data-<field>` classes (e.g. `druid-data-location`,
 * `druid-data-residents`), plus the page's lead paragraph for a
 * description.
 *
 * A handful of category members (e.g. "Overworld", a catch-all lore page)
 * have no infobox at all; those still get a name/description/href with
 * empty infobox-derived fields.
 */
export class LocationPageParser extends Parser<Location> {
  /**
   * Parses the HTML page and returns structured data.
   *
   * @returns {Promise<Location>} A promise that resolves to the parsed data.
   */
  async parse(): Promise<Location> {
    const name = this._getName();
    const images = this._getImages();

    return {
      id: toId(name),
      name,
      href: this._url,
      description: this._getDescription(),
      image: images[0]?.src || '',
      images,
      region: this._getLink('location'),
      types: this._getTypes(),
      residents: this._getResidents(),
      unlock: this._getRequirement('unlock'),
      upgrade: this._getRequirement('upgrade'),
      theme: this._getText('.druid-data-theme'),
      extra: this._getExtra(),
    };
  }

  /**
   * Extracts the location's name from the infobox title, falling back to
   * the page's `<h1>` for the rare page without an infobox.
   *
   * @returns {string} The location's name.
   */
  private _getName(): string {
    return this._getText('.druid-title') || this._getText('#firstHeading') || 'Unknown Location';
  }

  /**
   * Extracts the first non-empty lead paragraph as the location's
   * description.
   *
   * @returns {string} The description text, empty if the page has no
   * descriptive paragraph before its first table/section.
   */
  private _getDescription(): string {
    let description = '';

    this._get('.mw-parser-output > p').each((_index: number, el: any): void => {
      if (description) {
        return;
      }

      const text = this._page(el).text().trim();

      if (text) {
        description = text;
      }
    });

    return description;
  }

  /**
   * Extracts every image in the infobox's image gallery (the tabbed
   * "Starting"/"Expanded", seasonal exteriors, map placements, etc.).
   *
   * @returns {LocationImage[]} The location's images, in page order.
   */
  private _getImages(): LocationImage[] {
    const images: LocationImage[] = [];

    this._get('.druid-main-images-file').each((_index: number, el: any): void => {
      const file = this._page(el);
      const img = file.find('img').first();
      const src = img.attr('src');

      if (!src) {
        return;
      }

      images.push({
        src: `${BASE_URL}${src}`,
        alt: img.attr('alt') || '',
        caption: file.find('.druid-main-images-caption').first().text().trim(),
      });
    });

    return images;
  }

  /**
   * Extracts a single-link infobox row (e.g. the "Location" row pointing
   * at a location's parent region).
   *
   * @param {string} field - The row's field name (matches `druid-data-<field>`).
   * @returns {LocationLink | null} The linked page, or null if the row is absent/empty.
   */
  private _getLink(field: string): LocationLink | null {
    const data = this._getFirst(`.druid-data-${field}`);
    const text = data.text().trim();

    if (!text) {
      return null;
    }

    const anchor = data.find('a').first();
    const href = anchor.attr('href') || '';
    const name = anchor.text().trim() || text;

    return {
      name,
      id: toId(name),
      href: href ? `${BASE_URL}${href}` : '',
    };
  }

  /**
   * Extracts the "Type" row's value(s). Types with wiki categories (e.g.
   * "Store", "Residence") are linked and separated with " / "; plain-text
   * types (e.g. "Region (not seen in game)") are kept as a single entry.
   *
   * @returns {string[]} The location's type(s).
   */
  private _getTypes(): string[] {
    const data = this._getFirst('.druid-data-type');

    if (data.length === 0) {
      return [];
    }

    const links = data.find('a');

    if (links.length > 0) {
      return links.map((_index: number, el: any) => this._page(el).text().trim()).get();
    }

    const text = data.text().trim();

    return text ? text.split('/').map((part: string) => part.trim()).filter(Boolean) : [];
  }

  /**
   * Extracts the "Residents" row's entries. Entries are `<br>`-separated,
   * some linked to a character/animal page and some plain text (e.g.
   * unlinked lore characters), matching the pattern used for character
   * relatives in `character.parser.ts`.
   *
   * @returns {LocationResident[]} The location's residents.
   */
  private _getResidents(): LocationResident[] {
    const residents: LocationResident[] = [];
    const data = this._getFirst('.druid-data-residents');

    if (data.length === 0) {
      return residents;
    }

    let name = '';
    let href = '';

    const flush = (): void => {
      const trimmed = name.trim();

      if (trimmed) {
        residents.push({
          name: trimmed,
          id: toId(trimmed),
          href,
        });
      }

      name = '';
      href = '';
    };

    data.contents().each((_index: number, node: any): void => {
      if (node.type === 'tag' && node.name === 'br') {
        flush();
      } else if (node.type === 'text') {
        name += node.data;
      } else if (node.type === 'tag' && node.name === 'a') {
        const linkText = this._page(node).text().trim();

        if (linkText) {
          name += linkText;
          href = href || (node.attribs?.href ? `${BASE_URL}${node.attribs.href}` : '');
        }
      } else if (node.type === 'tag') {
        // Wrapped sprite/icon spans (e.g. the "Farm Animals" row's icon)
        // and trailing notes like "(conditional)".
        name += this._page(node).text();
      }
    });

    flush();

    return residents;
  }

  /**
   * Extracts an unlock/upgrade requirement row (e.g. `Story Quest "Unlocking The Mines"`).
   *
   * @param {string} field - The row's field name (matches `druid-data-<field>`).
   * @returns {LocationRequirement | null} The requirement, or null if the row is absent/empty.
   */
  private _getRequirement(field: string): LocationRequirement | null {
    const data = this._getFirst(`.druid-data-${field}`);
    const text = data.text().trim();

    if (!text) {
      return null;
    }

    const href = data.find('a').last().attr('href') || '';

    return {
      text,
      href: href ? `${BASE_URL}${href}` : '',
    };
  }

  /**
   * Extracts any infobox rows not covered by `KNOWN_FIELDS` (e.g. the
   * Mines sub-areas' "Floors"/"To Progress" rows). Some of these rows use
   * tabbed `druid-toggleable-data` values instead of a plain
   * `druid-data-<field>` div, so both shapes are handled.
   *
   * @returns {Record<string, string>} A map of field name to its text value.
   */
  private _getExtra(): Record<string, string> {
    const extra: Record<string, string> = {};

    this._get('.druid-row').each((_index: number, el: any): void => {
      const row = this._page(el);
      const rowClass = (row.attr('class') || '').split(/\s+/).find((cls: string) => cls.startsWith('druid-row-'));

      if (!rowClass) {
        return;
      }

      const field = rowClass.replace('druid-row-', '');

      if (KNOWN_FIELDS.has(field)) {
        return;
      }

      let value = this._getText(`.druid-data-${field}`);

      if (!value) {
        const variants: string[] = [];

        row.find('.druid-toggleable-data').each((_i: number, variant: any): void => {
          const clone = this._page(variant).clone();
          clone.find('span').remove();
          const variantText = clone.text().trim();

          if (variantText) {
            variants.push(variantText);
          }
        });

        value = variants.join(' | ');
      }

      if (value) {
        extra[field] = value;
      }
    });

    return extra;
  }
}
