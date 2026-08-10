// Types
import { EquipmentType } from './tools';

/**
 * A crafting ingredient required to make a piece of equipment.
 */
export interface EquipmentIngredient {
  /**
   * Unique identifier for the ingredient item.
   */
  id: string;

  /**
   * Name of the ingredient item.
   */
  name: string;

  /**
   * The quantity of the ingredient required.
   */
  quantity: number;

  /**
   * Image of the ingredient item.
   */
  image: string;
}

/**
 * Represents a piece of equipment (armor) in the game.
 */
export interface Equipment {
  /**
   * Unique identifier for the piece of equipment.
   */
  id: string;

  /**
   * Name of the piece of equipment.
   */
  name: string;

  /**
   * Description of the piece of equipment.
   */
  description: string;

  /**
   * Image of the piece of equipment.
   */
  image: string;

  /**
   * The equipment slot this item is worn in.
   */
  type: EquipmentType;

  /**
   * The tier/set this piece of equipment belongs to (e.g. "copper", "dragonsworn"),
   * derived from its name.
   */
  tier: string;

  /**
   * The amount of defense the piece of equipment provides.
   */
  defense: number;

  /**
   * The sell price of the piece of equipment. `0` if it can not be sold.
   */
  sell: number;

  /**
   * How the piece of equipment is obtained (e.g. Blacksmithing, quest reward).
   */
  source: string;

  /**
   * The ingredients required to craft the piece of equipment, if craftable.
   */
  ingredients: EquipmentIngredient[];

  /**
   * The crafting station required to craft the piece of equipment (e.g. Anvil).
   */
  'crafting-station': string;

  /**
   * The time it takes to craft the piece of equipment, in minutes.
   */
  'craft-time': number;

  /**
   * The Blacksmithing skill level required to craft the piece of equipment.
   */
  'skill-level': number;

  /**
   * The purchase price of the piece of equipment, if it can be bought directly.
   */
  price: number;

  /**
   * Link to the piece of equipment's wiki page.
   */
  href: string;
}
