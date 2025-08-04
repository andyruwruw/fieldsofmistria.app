// Types
import { Rarity, Season } from './index';
import { Weather } from './weather';

/**
 * Places where fish can be found.
 */
export type FishLocation = 'River' | 'Ocean' | 'Pond' | 'Any';

/**
 * Sizes of fish.
 */
export type FishSize = 'Small' | 'Medium' | 'Large' | 'Giant' | 'Any';

/**
 * Represents a fish in the game.
 */
export interface Fish {
  /**
   * Unique identifier for the fish.
   */
  id: string;

  /**
   * Name of the fish.
   */
  name: string;

  /**
   * Description of the fish.
   */
  description: string;

  /**
   * Sell price of the fish.
   */
  sell: number;

  /**
   * Location where the fish can be found.
   */
  location: FishLocation;

  /**
   * Seasons in which the fish can be caught.
   */
  seasons: Season[];

  /**
   * Weather conditions required for the fish to spawn.
   */
  weather: Weather[];

  /**
   * Rarity of the fish.
   */
  rarity: Rarity;

  /**
   * Size of the fish.
   */
  size: FishSize;

  /**
   * Whether the fish is catchable.
   */
  catchable: boolean;

  /**
   * Whether the fish is diveable.
   */
  diveable: boolean;

  /**
   * Image URL of the fish.
   */
  image: string;

  /**
   * Link to the fish's page.
   */
  href: string;
}
