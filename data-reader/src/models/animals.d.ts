// Types
import { Gender } from './index';

/**
 * Defines the home locations for animals in the game.
 */
export type AnimalHome = 'Barn' | 'Coop' | 'Home' | 'Unknown' | string;

/**
 * Represents the produce that an animal can provide.
 */
export interface AnimalProduce {
  /**
   * The item that this animal produces.
   */
  id: string;

  /**
   * The gender of the animal that produces this item.
   */
  gender: Gender;

  /**
   * How many days between each produce item.
   */
  occurance: number;

  /**
   * The number of hearts required to produce this item.
   */
  hearts: number;
}

/**
 * Defines a certain species of animal in the game.
 */
export interface Animal {
  /**
   * The animal's unique identifier.
   */
  id: string;

  /**
   * The animal's name.
   */
  name: string;

  /**
   * Where this animal resides.
   */
  home: AnimalHome;

  /**
   * Different tier prices.
   */
  prices: number[];

  /**
   * Different produce items this animal can provide.
   */
  produce: AnimalProduce[];

  /**
   * Colors that this animal can be by tier.
   */
  colors: string[][];

  /**
   * The animal's icon image.
   */
  'small-icon': string;

  /**
   * The animal's image.
   */
  images: Record<string, string[]>;

  /**
   * Link to the animal's wiki page.
   */
  href: string;
}
