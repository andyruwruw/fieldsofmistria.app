/**
 * Types of spells available in the game.
 */
export type SpellType = 'healing'
| 'farming'
| 'offense'
| string;

/**
 * Represents a spell in the game.
 */

export interface Spell {
  /**
   * Unique identifier for the spell.
   */
  id: string;

  /**
   * Name of the spell.
   */
  name: string;

  /**
   * Description of the spell.
   */
  description: string;

  /**
   * Type of the spell (e.g., Healing, Farming, Offense).
   */
  type: SpellType;

  /**
   * The amount of mana required to cast the spell.
   */
  mana: number;

  /**
   * How to unlock the spell.
   */
  unlocking: string;

  /**
   * Link to the spell's wiki page.
   */
  href: string;
}
