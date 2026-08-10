/**
 * The wiki's own categorization of a quest, based on which section of the
 * `Quests` page it's listed under.
 */
export type QuestType =
  | 'story'
  | 'festival'
  | 'important'
  | 'heart'
  | 'request'
  | 'special-request'
  | 'crown-request'
  | 'cooking-challenge'
  | 'mission';

/**
 * A single item reward granted by completing a quest.
 */
export interface QuestRewardItem {
  /**
   * Unique identifier for the reward item.
   */
  id: string;

  /**
   * Display name of the reward item.
   */
  name: string;

  /**
   * Wiki page URL for the reward item.
   */
  href: string;

  /**
   * Quantity of the item granted.
   */
  quantity: number;
}

/**
 * The full set of rewards granted by completing a quest.
 */
export interface QuestRewards {
  /**
   * Item rewards (seeds, food, furniture, recipes, etc.).
   */
  items: QuestRewardItem[];

  /**
   * Tesserae (currency) reward, 0 if none.
   */
  tesserae: number;

  /**
   * Renown reward, 0 if none.
   */
  renown: number;
}

/**
 * Represents a quest in the game. All quests live as rows in tables on the
 * single `/wiki/Quests` page (organized into sections/sub-sections) rather
 * than having individual wiki pages.
 */
export interface Quest {
  /**
   * Unique identifier for the quest, derived from its name.
   */
  id: string;

  /**
   * Name of the quest.
   */
  name: string;

  /**
   * The wiki's own categorization of the quest.
   */
  type: QuestType;

  /**
   * Name of the section/sub-section of the Quests page the quest is listed under (e.g. "Mines' Progression Quests").
   */
  section: string;

  /**
   * Description/flavor text of the quest.
   */
  description: string;

  /**
   * Name of the NPC who gives the quest, empty string if the quest isn't tied to a specific NPC (e.g. posted on the Request Board).
   */
  giver: string;

  /**
   * Raw text describing how/when the quest becomes available (e.g. "Upon leaving your house every year on 14 Spring from Celine").
   */
  source: string;

  /**
   * Prerequisites that must be met before the quest can be received.
   */
  requirementsToReceive: string;

  /**
   * Objectives/steps that must be completed to finish the quest.
   */
  requirementsToComplete: string;

  /**
   * Rewards granted for completing the quest.
   */
  rewards: QuestRewards;

  /**
   * Friendship hearts required to receive the quest, 0 if not a heart quest.
   */
  friendshipLevel: number;

  /**
   * Where the quest takes place, mainly populated for heart quests.
   */
  location: string;

  /**
   * The dish required to complete a cooking challenge, empty string otherwise.
   */
  requiredDish: string;

  /**
   * The monsters (and quantity) required to complete a mission quest, empty string otherwise.
   */
  requiredMonsters: string;

  /**
   * Where to find the required monsters for a mission quest, empty string otherwise.
   */
  monsterLocation: string;

  /**
   * Display order within its section (from the "#" column), 0 if not numbered.
   */
  order: number;

  /**
   * Wiki page URL (with anchor) for the quest.
   */
  href: string;
}
