// Types
import {
  Gender,
  Season,
} from './index';

/**
 * Marital status of a character.
 */
export type CharacterMaritalStatus = 'Single' | 'Married' | 'Divorced' | 'Widowed';

/**
 * Represents the species of a character.
 */
export type CharacterSpecies = 'Human' | 'Chicken' | 'Dog';

/**
 * Represents the type of relationship a character can have with another character.
 */
export type CharacterRelationType = 'Mother' | 'Father' | 'Young sister' | 'Older sister' | string;

/**
 * Represents a relationship between characters.
 */
export interface CharacterRelation {
  /**
   * The ID of the character that this relation is with.
   */
  id: string;

  /**
   * The type of relationship.
   */
  type: CharacterRelationType;
}

/**
 * Represents a character in the game.
 */
export interface Character {
  /**
   * Unique identifier for the character.
   */
  id: string;

  /**
   * Name of the character.
   */
  name: string;

  /**
   * Character's occupation(s).
   * This can be a single occupation or an array of occupations.
   * For example, ['Farmer', 'Blacksmith'].
   */
  occupation: string;

  /**
   * Marital status of the character.
   */
  'marital-status': CharacterMaritalStatus;

  /**
   * What season the character's birthday falls in.
   */
  'birthday-season': Season;

  /**
   * The day of the month when the character's birthday occurs.
   */
  'birthday-day': number;

  /**
   * The character's species.
   */
  species: CharacterSpecies;

  /**
   * The character's gender.
   */
  gender: Gender;

  /**
   * The character's eye color.
   */
  'eye-color': string;

  /**
   * The image representing the character in spring.
   */
  'spring-image': string;

  /**
   * The image representing the character in summer.
   */
  'summer-image': string;

  /**
   * The image representing the character at the beach.
   */
  'beach-image': string;

  /**
   * The image representing the character in fall.
   */
  'fall-image': string;

  /**
   * The image representing the character in winter.
   */
  'winter-image': string;

  /**
   * The image representing the character in their icon form.
   */
  'icon-image': string;

  /**
   * The image representing the character in their small icon form.
   */
  'small-icon-image': string;

  /**
   * Whether the character can be dated.
   */
  'dateable': boolean;

  /**
   * The character's relationships with other characters.
   * This is an array of CharacterRelation objects.
   */
  relations: CharacterRelation[];

  /**
   * The character's favorite items.
   * This is an array of strings representing item names.
   */
  loved: string[];

  /**
   * The character's liked items.
   * This is an array of strings representing item names.
   */
  liked: string[];

  /**
   * The character's disliked items.
   * This is an array of strings representing item names.
   */
  disliked: string[];

  /**
   * The character's hated items.
   * This is an array of strings representing item names.
   */
  hated: string[];

  /**
   * Quests that the character can give.
   * This is an array of strings representing quest IDs.
   */
  quests: string[];

  /**
   * Requests that the character can make.
   * This is an array of strings representing request IDs.
   */
  requests: string[];

  /**
   * Link to the character's wiki page.
   */
  href: string;
}
