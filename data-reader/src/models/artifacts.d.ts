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
