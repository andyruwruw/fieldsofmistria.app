// Packages
import { Cheerio } from 'cheerio';

// Local Imports
import { BASE_URL } from '../config';
import { Parser } from './parser';

// Types
import {
  Blacksmithing,
  BlacksmithingCategory,
  BlacksmithingCraftTime,
  BlacksmithingIngredient,
  BlacksmithingRecipe,
  BlacksmithingSkillPerk,
} from '../models/blacksmithing';

/**
 * Matches a craft time (e.g. "1h 0m" or "20m"), optionally followed by the
 * skill perk that unlocks it (e.g. "20m (with Time Sensitive I Skill)").
 */
const TIME_REGEX = /(\d+h\s*\d+m|\d+m)\s*(?:\(with\s+([^)]+?)\s+Skill\))?/g;

/**
 * Matches a parenthesized quantity (e.g. "(10)").
 */
const QUANTITY_REGEX = /\((\d+)\)/g;

/**
 * Matches the skill perk name inside a "(with X Skill)" clause.
 */
const SKILL_REGEX = /with\s+([^)]+?)\s+Skill/;

/**
 * The recipe sub-sections found under the "Recipes" heading, in the order
 * they appear on the page.
 */
const RECIPE_SECTIONS: { heading: string; category: BlacksmithingCategory }[] = [
  { heading: 'Ingots', category: 'ingot' },
  { heading: 'Tools', category: 'tool' },
  { heading: 'Swords', category: 'sword' },
  { heading: 'Armor', category: 'armor' },
];

/**
 * Parses the Blacksmithing page to extract its skill perks and recipes.
 */
export class BlacksmithingParser extends Parser<Blacksmithing> {
  /**
   * Parses the HTML page and returns structured data.
   *
   * @returns {Promise<Blacksmithing>} A promise that resolves to the parsed data.
   */
  async parse(): Promise<Blacksmithing> {
    return {
      recipes: this._parseRecipes(),
      'skill-perks': this._parseSkillPerks(),
    };
  }

  /**
   * Converts a name into the codebase's id convention.
   *
   * @param {string} name The name to convert.
   * @returns {string} The generated id.
   */
  private _id(name: string): string {
    return name.toLowerCase().replace(/\s+/g, '-').trim();
  }

  /**
   * Parses every "Tier N (Lvl M)" skill perk table under the "Skill Perks" heading.
   *
   * @returns {BlacksmithingSkillPerk[]} The parsed skill perks.
   */
  private _parseSkillPerks(): BlacksmithingSkillPerk[] {
    const perks: BlacksmithingSkillPerk[] = [];

    const header = this._get('.mw-parser-output > h2').filter((_i: number, el: any) => (
      this._page(el).text().trim() === 'Skill Perks'
    ));

    const tables = header.nextUntil('h2', 'table.wikitable');

    tables.each((_i: number, table: any) => {
      const $table = this._page(table);
      const rows = $table.find('> tbody > tr');

      let tier = 0;
      let level = 0;

      rows.each((i: number, tr: any) => {
        const $tr = this._page(tr);

        if (i === 0) {
          const match = $tr.text().trim().match(/Tier\s+(\d+)\s*\(Lvl\s+(\d+)\)/);

          if (match) {
            tier = parseInt(match[1], 10);
            level = parseInt(match[2], 10);
          }

          return;
        }

        if (i === 1) {
          return; // Column header row (Skill Perk / Description / Cost).
        }

        const cells = $tr.find('> td');

        if (cells.length < 4) {
          return;
        }

        const image = this._page(cells[0]).find('img').first();
        const name = this._page(cells[1]).text().trim();
        const description = this._page(cells[2]).text().trim();
        const cost = parseInt(this._page(cells[3]).text().replace(/\D+/g, ''), 10) || 0;

        if (!name) {
          return;
        }

        perks.push({
          id: this._id(name),
          name,
          description,
          image: image.attr('src') ? `${BASE_URL}${image.attr('src')}` : '',
          tier,
          level,
          cost,
        });
      });
    });

    return perks;
  }

  /**
   * Parses every recipe table under the "Recipes" heading (Ingots, Tools, Swords, Armor).
   *
   * @returns {BlacksmithingRecipe[]} The parsed recipes.
   */
  private _parseRecipes(): BlacksmithingRecipe[] {
    const recipes: BlacksmithingRecipe[] = [];

    for (const { heading, category } of RECIPE_SECTIONS) {
      const header = this._get('.mw-parser-output > h3').filter((_i: number, el: any) => (
        this._page(el).text().trim() === heading
      ));

      const table = header.nextUntil('h3, h2', 'table.wikitable').first();

      if (!table || table.length === 0) {
        continue;
      }

      recipes.push(...this._parseRecipeTable(table, category));
    }

    return recipes;
  }

  /**
   * Parses a single recipe table, splitting rows that produce multiple items
   * (e.g. "Copper Pickaxe / Axe / Hoe / ...") into one recipe per item.
   *
   * @param {Cheerio<any>} table The recipe table to parse.
   * @param {BlacksmithingCategory} category The category this table belongs to.
   * @returns {BlacksmithingRecipe[]} The parsed recipes.
   */
  private _parseRecipeTable(
    table: Cheerio<any>,
    category: BlacksmithingCategory,
  ): BlacksmithingRecipe[] {
    const recipes: BlacksmithingRecipe[] = [];
    const rows = table.find('> tbody > tr');

    if (rows.length === 0) {
      return recipes;
    }

    const headers = this._page(rows[0]).find('> th').map((_i: number, th: any) => (
      this._page(th).text().trim()
    )).get() as string[];

    const fullColumnCount = headers.length;
    const hasAttack = headers.includes('Attack');
    const hasDefense = headers.includes('Defense');

    // The Time column is often merged (via rowspan) across several rows, so
    // rows that are missing a trailing cell reuse the last seen Time cell.
    let lastTimeCell: Cheerio<any> | undefined;

    rows.each((i: number, tr: any) => {
      if (i === 0) {
        return; // Column header row.
      }

      const cells = this._page(tr).find('> td');

      if (cells.length === 0) {
        return;
      }

      const imageCell = this._page(cells[0]);
      const nameCell = this._page(cells[1]);

      let index = 2;
      let attack: number | undefined;
      let defense: number | undefined;

      if (hasAttack) {
        attack = this._parseIconNumber(this._page(cells[index]));
        index += 1;
      } else if (hasDefense) {
        defense = this._parseIconNumber(this._page(cells[index]));
        index += 1;
      }

      const ingredientCell = this._page(cells[index]);
      index += 1;

      const craftingLevel = this._parseIconNumber(this._page(cells[index]));
      index += 1;

      let timeCell: Cheerio<any> | undefined;

      if (cells.length === fullColumnCount) {
        timeCell = this._page(cells[index]);
        lastTimeCell = timeCell;
      } else {
        timeCell = lastTimeCell;
      }

      const { time, timeReductions } = this._parseTime(timeCell);
      const ingredient = this._parseIngredient(ingredientCell);

      const nameLinks = nameCell.find('a[title]').filter((_i: number, a: any) => (
        this._page(a).text().trim().length > 0
      ));
      const images = imageCell.find('img');

      nameLinks.each((outputIndex: number, a: any) => {
        const $a = this._page(a);
        const name = $a.attr('title') || $a.text().trim();

        if (!name) {
          return;
        }

        const href = $a.attr('href') ? `${BASE_URL}${$a.attr('href')}` : '';
        const img = images.eq(outputIndex);
        const image = img.attr('src') ? `${BASE_URL}${img.attr('src')}` : '';

        const recipe: BlacksmithingRecipe = {
          id: this._id(name),
          name,
          image,
          href,
          category,
          ingredient,
          'crafting-level': craftingLevel,
          time,
          'time-reductions': timeReductions,
        };

        if (attack !== undefined) {
          recipe.attack = attack;
        }

        if (defense !== undefined) {
          recipe.defense = defense;
        }

        recipes.push(recipe);
      });
    });

    return recipes;
  }

  /**
   * Parses a cell whose text is an icon followed by a number (e.g. Attack, Defense, Crafting Level).
   *
   * @param {Cheerio<any>} cell The cell to parse.
   * @returns {number} The parsed number, or 0 if none was found.
   */
  private _parseIconNumber(cell: Cheerio<any>): number {
    const match = cell.text().trim().match(/(\d+)/);

    return match ? parseInt(match[1], 10) : 0;
  }

  /**
   * Parses the "Ingredient" cell of a recipe row, including the reduced quantity
   * unlocked by the relevant "Expert" skill perk when present.
   *
   * @param {Cheerio<any>} cell The ingredient cell to parse.
   * @returns {BlacksmithingIngredient} The parsed ingredient.
   */
  private _parseIngredient(cell: Cheerio<any>): BlacksmithingIngredient {
    const link = cell.find('a[title]').filter((_i: number, a: any) => (
      this._page(a).text().trim().length > 0
    )).first();

    const name = link.attr('title') || link.text().trim();
    const href = link.attr('href') ? `${BASE_URL}${link.attr('href')}` : '';
    const image = cell.find('img').first();
    const imageSrc = image.attr('src') ? `${BASE_URL}${image.attr('src')}` : '';

    const text = cell.text().replace(/\s+/g, ' ').trim();
    const quantities = [...text.matchAll(QUANTITY_REGEX)].map((match) => parseInt(match[1], 10));
    const skillMatch = text.match(SKILL_REGEX);

    const ingredient: BlacksmithingIngredient = {
      id: this._id(name),
      name,
      image: imageSrc,
      href,
      quantity: quantities[0] || 0,
    };

    if (quantities.length > 1 && skillMatch) {
      ingredient['reduced-quantity'] = quantities[1];
      ingredient['reduced-by'] = skillMatch[1].trim();
    }

    return ingredient;
  }

  /**
   * Parses a "Time" cell, extracting the base craft time and any faster
   * alternatives unlocked by Time Sensitive skill perks.
   *
   * @param {Cheerio<any> | undefined} cell The time cell to parse.
   * @returns {{ time: number; timeReductions: BlacksmithingCraftTime[] }} The parsed craft times.
   */
  private _parseTime(cell: Cheerio<any> | undefined): { time: number; timeReductions: BlacksmithingCraftTime[] } {
    if (!cell || cell.length === 0) {
      return { time: 0, timeReductions: [] };
    }

    // The wiki source is occasionally missing the closing paren on a
    // "(with X Skill)" clause (e.g. the Tools table's Iron row) — patch it
    // back in so the regex below doesn't swallow the following clause.
    const text = cell.text().replace(/\s+/g, ' ').trim().replace(/Skill(?!\))/g, 'Skill)');
    const matches = [...text.matchAll(TIME_REGEX)];

    if (matches.length === 0) {
      return { time: 0, timeReductions: [] };
    }

    const time = this._timeToMinutes(matches[0][1]);
    const timeReductions: BlacksmithingCraftTime[] = [];

    for (let i = 1; i < matches.length; i += 1) {
      const [, timeText, skill] = matches[i];

      if (!skill) {
        continue;
      }

      timeReductions.push({
        minutes: this._timeToMinutes(timeText),
        'reduced-by': skill.trim(),
      });
    }

    return { time, timeReductions };
  }
}
