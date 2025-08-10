// Types
import { Season } from './weather';

/**
 * Types of museum sets.
 */
export type MuseumSetType = MuseumFishSetLocation
| MuseumFloralSetType;

/**
 * Types of museum fish sets.
 */
export type MuseumFishSetType = 'generic'
| 'river'
| 'ocean'
| 'pond'
| 'deep-woods'
| 'mines'
| 'legendary';

/**
 * Types of museum floral sets.
 */
export type MuseumFloralSetType = 'crop'
| 'flower'
| 'forage'
| 'deep-woods'
| 'mines';

/**
 * Types of museum insect sets.
 */
export type MuseumInsectSetType = 'generic'
| 'seasonal'
| 'rare'
| 'legendary'
| 'mines'
| 'grass'
| 'beach'
| 'deep-woods';

/**
 * Types of museum archaeology sets.
 */
export type ArchaeologySetType = 'the-narrows'
| 'the-eastern-road'
| 'sweetwater-farm'
| 'the-western-ruins'
| 'the-beach'
| 'generic'
| 'fishing'
| 'diving'
| 'mines'
| 'ritual-chambers'
| 'mist-spots'
| 'the-farm'
| 'metals'
| 'gems'
| 'deep-woods'
| 'dragons';

/**
 * A set of items in the museum.
 */
export interface MuseumSet {
  /**
   * The ID of the set.
   */
  id: string;

  /**
   * The name of the set.
   */
  name: string;

  /**
   * The image URL of the set.
   */
  items: string[];

  /**
   * The description of the set.
   */
  wing: string;

  /**
   * The season when the set is available.
   */
  season: Season;

  /**
   * Whether this set is legendary.
   */
  legendary: boolean;
}

/**
 * A wing in the museum.
 */
export interface MuseumWing {
  /**
   * The ID of the wing.
   */
  id: string;

  /**
   * The name of the wing.
   */
  name: string;

  /**
   * The image URL of the wing.
   */
  image: string;

  /**
   * The href link of the wing.
   */
  href: string;
}

export interface MuseumDisplaySet {
  /**
   * The ID of the set.
   */
  id: string;

  /**
   * The name of the set.
   */
  name: string;

  /**
   * The image URL of the set.
   */
  items: MuseumDisplaySetItem[];

  /**
   * The wing this set belongs to.
   */
  wing: string;

  /**
   * Whether this set is complete.
   */
  done: boolean;
}

export interface MuseumDisplaySetItem {
  /**
   * The ID of the item.
   */
  id: string;

  /**
   * The name of the item.
   */
  name: string;

  /**
   * The image URL of the item.
   */
  image: string;

  /**
   * The description of the item.
   */
  description: string;

  /**
   * Whether this item is complete.
   */
  done: boolean;
}

/**
 * Represents an artifact in the game.
 */
export interface Artifact {
  /**
   * Unique identifier for the artifact.
   */
  id: string;

  /**
   * Name of the artifact.
   */
  name: string;

  /**
   * Description of the artifact.
   */
  description: string;

  /**
   * Rarity of the artifact.
   */
  rarity: string;

  /**
   * The image representing the artifact.
   */
  image: string;

  /**
   * Location where the artifact can be found.
   */
  location: string;

  /**
   * Link to the artifact's wiki page.
   */
  href: string;

  /**
   * Sell price of the artifact.
   */
  sell: number;
}
