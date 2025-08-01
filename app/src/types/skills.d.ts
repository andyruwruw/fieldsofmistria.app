/**
 * Types of skills available in the game.
 */
export type SkillCategory = 'farming'
| 'fishing'
| 'archaeology'
| 'cooking'
| 'ranching'
| 'woodcrafting'
| 'blacksmithing'
| 'mining'
| 'combat'
| string;

/**
 * Represents a skill in the game.
 */
export interface Skill {
  /**
   * Unique identifier for the skill.
   */
  id: string;

  /**
   * Name of the skill.
   */
  name: string;

  /**
   * Description of the skill.
   */
  description: string;

  /**
   * Cost of essence to unlock the skill.
   */
  cost: number;

  /**
   * The category of the skill (e.g., Farming, Mining, Combat).
   */
  category: string;

  /**
   * Tier within the category.
   * This indicates the skill's level or progression within its category.
   */
  tier: number;

  /**
   * Skill level required to unlock the skill.
   * This is the minimum level a character must have in the skill's category to unlock it.
   */
  level: number;

  /**
   * The skill's index within its category.
   */
  index: number;

  /**
   * The skill's icon image URL.
   */
  'icon-image': string;

  /**
   * Link to the skill's wiki page.
   */
  href: string;
}
