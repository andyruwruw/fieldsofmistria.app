/**
 * A stall present at a festival, with the villagers running it.
 */
export interface EventStall {
  /**
   * Name of the stall.
   */
  name: string;

  /**
   * IDs of the villagers running the stall.
   */
  vendors: string[];
}

/**
 * Represents a festival/event in the game.
 */
export interface Event {
  /**
   * Unique identifier for the event.
   */
  id: string;

  /**
   * Name of the event.
   */
  name: string;

  /**
   * Wiki page URL for the event.
   */
  href: string;

  /**
   * Where the event takes place.
   */
  location: string;

  /**
   * Day of the season the event occurs on.
   */
  day: number;

  /**
   * Season the event occurs in.
   */
  season: string;

  /**
   * How often the event occurs (e.g. "annual").
   */
  frequency: string;

  /**
   * IDs (name slugs) of quests tied to this event.
   */
  quests: string[];

  /**
   * Name of the event's musical theme.
   */
  theme: string;

  /**
   * URL of the event's theme audio, if any.
   */
  'theme-audio': string;

  /**
   * IDs (name slugs) of activities available during the event.
   */
  activities: string[];

  /**
   * Stalls set up during the event.
   */
  stalls: EventStall[];
}
