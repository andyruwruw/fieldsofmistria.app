// Types
import {
  Season,
  Weather,
} from './weather';

/**
 * Represents a bug in the game.
 */
export interface Bug {
  /**
   * Unique identifier for the bug.
   */
  id: string;

  /**
   * Name of the bug.
   */
  name: string;

  /**
   * Description of the bug.
   */
  description: string;

  /**
   * Sell price of the bug.
   */
  sell: number;

  /**
   * Location where the bug can be found.
   */
  location: string;

  /**
   * Conditions required for the bug to spawn.
   */
  'spawn-condition': string;

  /**
   * What seasons the bug can be found in.
   */
  seasons: Season[];

  /**
   * What weather conditions the bug can be found in.
   */
  weather: Weather[];

  /**
   * The time of day when the bug can be found.
   */
  'time-start': number;

  /**
   * The time of day when the bug can be found.
   */
  'time-end': number;

  /**
   * Rarity of the bug.
   */
  rarity: Rarity;

  /**
   * Image of the bug.
   */
  image: string;

  /**
   * Link to the bug's wiki page.
   */
  href: string;
}
