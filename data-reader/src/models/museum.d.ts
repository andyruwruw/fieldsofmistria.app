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
  id: string;

  name: string;

  image: string;

  href: string;
}
