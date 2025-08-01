export interface MonsterDrop {
  /**
   * Unique identifier for the drop.
   */
  id: string;

  /**
   * Chance of the drop occurring.
   */
  chance: number;
}

/**
 * Types of monsters available in the game.
 */
export type MonsterType = 'Sapling'
| 'Rock Clod'
| 'Ore Clod'
| 'Mushroom'
| 'Enchantern'
| 'Stalagmite'
| 'Essence Bat'
| 'Mimic'
| 'Flame Spirit'
| 'Lava Cat'
| string;

/**
 * Represents a monster in the game.
 */
export interface Monster {
  /**
   * Unique identifier for the monster.
   */
  id: string;

  /**
   * Name of the monster.
   */
  name: string;

  /**
   * Description of the monster.
   */
  description: string;

  /**
   * Image of the monster.
   */
  image: string;

  /**
   * The biome where the monster can be found.
   */
  biome: string;

  /**
   * The lowest floor where the monster can be found.
   */
  'lowest-floor': number;

  /**
   * The highest floor where the monster can be found.
   */
  'highest-floor': number;

  /**
   * The drops that the monster can give.
   */
  drops: MonsterDrop[];

  /**
   * The type of the monster.
   */
  type: MonsterType;

  /**
   * The amount of health the monster has.
   */
  health: number;

  /**
   * The amount of damage the monster deals.
   */
  damage: number;

  /**
   * How much essence the monster drops when defeated.
   */
  essense: number;

  /**
   * How much money the monster drops when defeated.
   */
  tesserae: number;
}
