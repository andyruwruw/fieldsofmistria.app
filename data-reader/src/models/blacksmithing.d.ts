/**
 * The recipe categories that make up the Blacksmithing recipe list.
 */
export type BlacksmithingCategory = 'ingot'
| 'tool'
| 'sword'
| 'armor';

/**
 * The material required to craft a Blacksmithing recipe.
 */
export interface BlacksmithingIngredient {
  /**
   * The material's unique identifier.
   */
  id: string;

  /**
   * The material's name.
   */
  name: string;

  /**
   * The material's icon image URL.
   */
  image: string;

  /**
   * Link to the material's wiki page.
   */
  href: string;

  /**
   * The quantity of the material required to craft the recipe.
   */
  quantity: number;

  /**
   * A lower quantity of the material required once the relevant skill perk (see `reduced-by`) is unlocked.
   */
  'reduced-quantity'?: number;

  /**
   * The name of the skill perk that unlocks the `reduced-quantity` requirement.
   */
  'reduced-by'?: string;
}

/**
 * An alternate, faster craft time unlocked by a skill perk.
 */
export interface BlacksmithingCraftTime {
  /**
   * The craft time, in minutes, once the skill perk is unlocked.
   */
  minutes: number;

  /**
   * The name of the skill perk that unlocks this craft time.
   */
  'reduced-by': string;
}

/**
 * A skill perk that can be unlocked by leveling up the Blacksmithing skill.
 */
export interface BlacksmithingSkillPerk {
  /**
   * The skill perk's unique identifier.
   */
  id: string;

  /**
   * The skill perk's name.
   */
  name: string;

  /**
   * The skill perk's description/effect.
   */
  description: string;

  /**
   * The skill perk's icon image URL.
   */
  image: string;

  /**
   * The tier this skill perk belongs to (1-5).
   */
  tier: number;

  /**
   * The Blacksmithing skill level required to unlock this perk's tier.
   */
  level: number;

  /**
   * The Essence cost to unlock this skill perk.
   */
  cost: number;
}

/**
 * A craftable Blacksmithing recipe (an Ingot, Tool, Sword, or Armor piece).
 */
export interface BlacksmithingRecipe {
  /**
   * The recipe's unique identifier.
   */
  id: string;

  /**
   * The name of the item this recipe produces.
   */
  name: string;

  /**
   * The item's icon image URL.
   */
  image: string;

  /**
   * Link to the item's wiki page.
   */
  href: string;

  /**
   * The category this recipe belongs to.
   */
  category: BlacksmithingCategory;

  /**
   * The attack power of the crafted item. Only present for Sword recipes.
   */
  attack?: number;

  /**
   * The defense granted by the crafted item. Only present for Armor recipes.
   */
  defense?: number;

  /**
   * The material required to craft this recipe.
   */
  ingredient: BlacksmithingIngredient;

  /**
   * The Blacksmithing skill level required to craft this recipe.
   */
  'crafting-level': number;

  /**
   * The base craft time, in minutes.
   */
  time: number;

  /**
   * Alternate, faster craft times unlocked by Time Sensitive skill perks.
   */
  'time-reductions': BlacksmithingCraftTime[];
}

/**
 * All of the data parsed from the Blacksmithing wiki page.
 */
export interface Blacksmithing {
  /**
   * The craftable recipes (Ingots, Tools, Swords, and Armor).
   */
  recipes: BlacksmithingRecipe[];

  /**
   * The skill perks unlockable by leveling up the Blacksmithing skill.
   */
  'skill-perks': BlacksmithingSkillPerk[];
}
