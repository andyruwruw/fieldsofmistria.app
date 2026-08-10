// Types
import { CosmeticType, CosmeticSubType } from './tools';

/**
 * A link extracted from a cosmetic's "Source" cell (e.g. a shop or NPC page).
 */
export interface CosmeticSourceLink {
  /**
   * The link's display text.
   */
  name: string;

  /**
   * The link's target URL.
   */
  href: string;
}

/**
 * Represents a cosmetic item (accessory, clothing piece, hairstyle, etc.)
 * the player character can wear. Cosmetic only, no stats.
 */
export interface Cosmetic {
  /**
   * Unique identifier for the cosmetic.
   */
  id: string;

  /**
   * Name of the cosmetic.
   */
  name: string;

  /**
   * The image representing the cosmetic.
   */
  image: string;

  /**
   * The broad category of cosmetic (accessories, clothes, hairstyles).
   */
  type: CosmeticType;

  /**
   * The specific slot/sub-type this cosmetic occupies.
   */
  subType: CosmeticSubType;

  /**
   * The wiki's finer-grained grouping within the sub-type
   * (e.g. "Hats", "Sleeveless Tops", "Short Hair").
   */
  group: string;

  /**
   * Whether this cosmetic is part of a themed outfit set.
   */
  partOfSet: boolean;

  /**
   * The name of the outfit set this cosmetic belongs to, if any.
   */
  setName?: string;

  /**
   * Link to the outfit set's wiki page, if any.
   */
  setHref?: string;

  /**
   * The number of color variants available for this cosmetic, if known.
   */
  colorVariants?: number;

  /**
   * How this cosmetic can be acquired (e.g. "Available From Character Creation",
   * a shop name, an event, "Unlocked", etc.), as plain text.
   */
  source: string;

  /**
   * Links (shops, NPCs, events, etc.) found in the "Source" cell.
   */
  sourceLinks: CosmeticSourceLink[];

  /**
   * The tesserae cost to buy this cosmetic, if it is purchasable. 0 otherwise.
   */
  price: number;

  /**
   * Free-text unlock requirements when the cosmetic isn't simply purchased
   * (e.g. "Museum Donations, Insects Wing 1 Set", "Renown, Town Rank Level 48, Iron").
   */
  unlockDetails?: string;

  /**
   * Link to the wiki page this cosmetic's data was parsed from. The wiki has
   * no per-item cosmetic pages, so this is the shared category page
   * (Accessories, Cosmetics (Clothes), or Cosmetics (Body)).
   */
  href: string;
}
