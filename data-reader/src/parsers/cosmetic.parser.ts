// Local Imports
import { convertTesseraeString } from '../utils/convert';
import { BASE_URL } from '../config';
import { Parser } from './parser';

// Types
import {
  Cosmetic,
  CosmeticSourceLink,
} from '../models/cosmetics';
import {
  CosmeticType,
  CosmeticSubType,
} from '../models/tools';

/**
 * Maps the wiki's h2/h3 section headings to a `CosmeticSubType`. Sections
 * that aren't a real, itemized sub-type (illustrative color galleries with
 * no per-item data, and "Unknowns" tables of unconfirmed items) are left
 * out on purpose and skipped while parsing.
 */
const SUBTYPE_BY_HEADING: Record<string, CosmeticSubType> = {
  'Head Wear': 'head-wear',
  'Glasses': 'glasses',
  'Back Accessories': 'back-accessory',
  'Tops': 'top',
  'Bottoms': 'bottom',
  'Shoes': 'shoes',
  'Hairstyles': 'hair',
  'Facial Hair': 'hair',
  'Eyes': 'eyes',
};

/**
 * Parses a cosmetic category page (Accessories, Cosmetics (Clothes), or
 * Cosmetics (Body)/Hairstyles). Unlike most other categories on the wiki,
 * cosmetics have no per-item detail pages: every item's full data (image,
 * source, price, set membership, color variants) lives directly in tables
 * on these three category pages. Because of that, this parser returns every
 * `Cosmetic` found on the page rather than a single item, i.e.
 * `Parser<Cosmetic[]>` instead of `Parser<Cosmetic>`.
 */
export class CosmeticPageParser extends Parser<Cosmetic[]> {
  /**
   * Parses the HTML page and returns structured data.
   *
   * @returns {Promise<Cosmetic[]>} A promise that resolves to every cosmetic found on the page.
   */
  async parse(): Promise<Cosmetic[]> {
    const type = this._getCosmeticType();
    const content = this._getFirst('div.mw-parser-output');
    const children = content.children();

    const results: Cosmetic[] = [];

    let subTypeHeading = '';
    let group = '';

    for (let i = 0; i < children.length; i += 1) {
      const element = children[i];

      if (element.type !== 'tag') {
        continue;
      }

      if (element.name === 'h2' || element.name === 'h3') {
        subTypeHeading = this._page(element).text().trim();
        group = subTypeHeading;
        continue;
      }

      if (element.name === 'h4') {
        group = this._page(element).text().trim();
        continue;
      }

      if (element.name !== 'table') {
        continue;
      }

      const subType = SUBTYPE_BY_HEADING[subTypeHeading];

      if (!subType) {
        continue; // "Unknowns" or a non-itemized section (e.g. color galleries).
      }

      const rows = this._page(element).find('tbody > tr');

      // Row 0 is the section caption (colspan title), row 1 is the header.
      for (let r = 2; r < rows.length; r += 1) {
        const cosmetic = this._parseCosmeticRow(
          rows.eq(r),
          type,
          subType,
          group,
        );

        if (cosmetic) {
          results.push(cosmetic);
        }
      }
    }

    return results;
  }

  /**
   * Determines the `CosmeticType` this page represents from its URL.
   *
   * @returns {CosmeticType} The cosmetic type for this page.
   */
  _getCosmeticType(): CosmeticType {
    if (this._url.includes('Accessories')) {
      return 'accessories';
    }

    if (this._url.includes('Clothes')) {
      return 'clothes';
    }

    return 'hairstyles';
  }

  /**
   * Parses a single item row from a cosmetic table. Tables come in two
   * shapes: accessories/clothes rows have 6 columns (Image, Item Name,
   * Part of a Set?, Color Variants, Source, Price), while hairstyles rows
   * have 4 (Image, Item Name, Source, Price).
   *
   * @param {any} row The row to parse.
   * @param {CosmeticType} type The cosmetic's type.
   * @param {CosmeticSubType} subType The cosmetic's sub-type.
   * @param {string} group The finer-grained wiki grouping (e.g. "Hats").
   * @returns {Cosmetic | null} The parsed cosmetic, or null if the row has no name.
   */
  _parseCosmeticRow(
    row: any,
    type: CosmeticType,
    subType: CosmeticSubType,
    group: string,
  ): Cosmetic | null {
    const cells = row.find('td');

    if (cells.length < 4) {
      return null;
    }

    const name = cells.eq(1).text().trim();

    if (!name) {
      return null;
    }

    const imageSrc = cells.eq(0).find('img').first().attr('src');
    const image = imageSrc ? `${BASE_URL}${imageSrc}` : '';

    const hasSetColumn = cells.length >= 6;

    const partOfSetCell = hasSetColumn ? cells.eq(2) : null;
    const colorVariantsCell = hasSetColumn ? cells.eq(3) : null;
    const sourceCell = hasSetColumn ? cells.eq(4) : cells.eq(2);
    const priceCell = hasSetColumn ? cells.eq(5) : cells.eq(3);

    const partOfSetText = partOfSetCell ? partOfSetCell.text().trim() : '';
    const partOfSet = partOfSetText.startsWith('Yes');
    const setLink = partOfSetCell ? partOfSetCell.find('a').first() : null;
    const setName = setLink && setLink.length ? setLink.text().trim() : undefined;
    const setHref = setLink && setLink.length && setLink.attr('href')
      ? `${BASE_URL}${setLink.attr('href')}`
      : undefined;

    const colorVariantsText = colorVariantsCell ? colorVariantsCell.text().trim() : '';
    const colorVariants = /^\d+$/.test(colorVariantsText) ? parseInt(colorVariantsText, 10) : undefined;

    const source = sourceCell.text().trim().replace(/\s+/g, ' ');
    const sourceLinks: CosmeticSourceLink[] = [];

    sourceCell.find('a').each((_index: number, link: any) => {
      const anchor = this._page(link);
      const linkText = anchor.text().trim();
      const linkHref = anchor.attr('href');

      if (linkText && linkHref) {
        sourceLinks.push({
          name: linkText,
          href: `${BASE_URL}${linkHref}`,
        });
      }
    });

    const priceText = priceCell.text().trim().replace(/\s+/g, ' ');
    const price = convertTesseraeString(priceText);
    const unlockDetails = price === 0 && priceText !== '' ? priceText : undefined;

    return {
      id: name.toLowerCase().replace(/\s+/g, '-').trim(),
      name,
      image,
      type,
      subType,
      group,
      partOfSet,
      setName,
      setHref,
      colorVariants,
      source,
      sourceLinks,
      price,
      unlockDetails,
      href: this._url,
    };
  }
}
