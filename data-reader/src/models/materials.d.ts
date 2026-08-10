// Types
import { Season } from './weather';

/**
 * A recipe or item that a material is used to craft.
 */
export interface MaterialRecipe {
  /**
   * Unique identifier for the recipe/item.
   */
  id: string;

  /**
   * Name of the recipe/item.
   */
  name: string;

  /**
   * Link to the recipe/item's wiki page.
   */
  href: string;
}

/**
 * Represents a crafting/mining resource material in the game (ore, wood, gems,
 * fiber, monster drops, cooking ingredients, etc.).
 */
export interface Material {
  /**
   * Unique identifier for the material.
   */
  id: string;

  /**
   * Name of the material.
   */
  name: string;

  /**
   * Description of the material.
   */
  description: string;

  /**
   * The image representing the material.
   */
  image: string;

  /**
   * Sell price of the material.
   */
  sell: number;

  /**
   * Crafting skills/disciplines associated with the material (e.g. Woodcrafting,
   * Blacksmithing, Cooking, Farming, Ranching).
   */
  skills: string[];

  /**
   * Human readable location(s) where the material can be obtained, joined together.
   */
  location: string;

  /**
   * Slugified location IDs where the material can be obtained.
   */
  locations: string[];

  /**
   * Seasons during which the material can be obtained.
   */
  seasons: Season[];

  /**
   * Health of the resource node/monster that yields this material, if applicable
   * (e.g. a forage node's hit points).
   */
  health: number;

  /**
   * Stamina cost to obtain the material from its node, if applicable.
   */
  stamina: number;

  /**
   * Human readable descriptions of how the material can be obtained (foraging,
   * mining, monster drops, purchases, rewards, etc.).
   */
  source: string[];

  /**
   * Whether the material can be donated to the museum.
   */
  donatable: boolean;

  /**
   * The museum wing/set the material belongs to, if donatable.
   */
  museumWing: string;

  /**
   * Recipes/items that use this material as an ingredient.
   */
  recipes: MaterialRecipe[];

  /**
   * Link to the material's wiki page.
   */
  href: string;
}
