/**
 * The type of weapon. Swords are currently the only weapon type in the
 * game; the wiki notes it is unconfirmed whether other types will be
 * added in the future.
 */
export type WeaponType = 'sword' | string;

/**
 * The tier/rarity of a weapon. Mirrors the tool progression
 * (worn -> copper -> iron -> silver -> gold) with an added top tier
 * (mistril), plus a parallel set of uncraftable/unbuyable rare tiers
 * found from treasure chests and mimics in each mine biome.
 */
export type WeaponTier = 'worn'
| 'copper'
| 'iron'
| 'silver'
| 'gold'
| 'mistril'
| 'scrap-metal'
| 'verdigris'
| 'crystal'
| 'tarnished-gold'
| string;

/**
 * A crafting ingredient required to make a weapon.
 */
export interface WeaponIngredient {
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
 * Represents a weapon in the game.
 */
export interface Weapon {
  /**
   * Unique identifier for the weapon.
   */
  id: string;

  /**
   * Name of the weapon.
   */
  name: string;

  /**
   * Description of the weapon.
   */
  description: string;

  /**
   * Image of the weapon.
   */
  image: string;

  /**
   * The type of weapon (e.g. sword).
   */
  type: WeaponType;

  /**
   * The tier/rarity of the weapon.
   */
  tier: WeaponTier;

  /**
   * The amount of attack damage the weapon deals.
   */
  attack: number;

  /**
   * The sell price of the weapon.
   */
  sell: number;

  /**
   * How the weapon is obtained (e.g. Blacksmithing, General Store, Treasure Chests).
   */
  source: string;

  /**
   * The ingredients required to craft the weapon, if craftable.
   */
  ingredients: WeaponIngredient[];

  /**
   * The crafting station required to craft the weapon (e.g. Anvil).
   */
  'crafting-station': string;

  /**
   * The time it takes to craft the weapon, in minutes.
   */
  'craft-time': number;

  /**
   * The Blacksmithing skill level required to craft the weapon.
   */
  'skill-level': number;

  /**
   * The purchase price of the weapon, if it can be bought directly.
   */
  price: number;

  /**
   * Link to the weapon's wiki page.
   */
  href: string;
}
