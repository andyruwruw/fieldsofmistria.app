/**
 * Types of buildings available in the game.
 */
export type BuildingType = 'House' | 'Shop' | 'Farm';

/**
 * Represents a building in the game.
 */
export interface Building {
  /**
   * Unique identifier for the building.
   */
  id: string;

  /**
   * Name of the building.
   */
  name: string;

  /**
   * The type of building (e.g., 'House', 'Shop', 'Farm').
   */
  type: BuildingType;

  /**
   * Link to the building's wiki page.
   */
  href: string;
}
