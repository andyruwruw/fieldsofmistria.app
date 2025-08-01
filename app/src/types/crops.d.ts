/**
 * Types of produce in the game.
 */
export type CropType = 'Crop' | 'Fruit' | 'Forageable';

/**
 * Called crop, but used to represent crops, fruits and forageables.
 */
export interface Crop {
  /**
   * Unique identifier for the crop.
   */
  id: string;

  /**
   * Name of the crop.
   */
  name: string;

  /**
   * Description of the crop.
   */
  description: string;

  /**
   * Growth time of the crop (in days).
   */
  'growth-time': number;

  /**
   * Regrowth time of the crop (in days).
   * This is optional and only applies to crops that can regrow after being harvested.
   */
  'regrow-time': number;

  /**
   * Locations where the crop can be found.
   */
  locations: string[];

  /**
   * Seasons in which the crop can be planted.
   */
  seasons: Season[];

  /**
   * The type of crop (e.g., 'Vegetable', 'Fruit', 'Flower').
   */
  type: CropType;

  /**
   * The selling price of the crop.
   */
  sell: number;

  /**
   * The image representing the crop.
   */
  image: string;

  /**
   * The image representing the crop when it is fully grown.
   */
  'seed-image': string;

  /**
   * Link to the crop's wiki page.
   */
  href: string;
}
