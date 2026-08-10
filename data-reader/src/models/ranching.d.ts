// Types
import { Gender } from './index';

/**
 * Categories of animal products, matching the sections on the wiki's
 * Ranching (Items) page.
 */
export type AnimalProductCategory = 'egg' | 'milk' | 'fiber' | 'other';

/**
 * A quality tier of an animal product (e.g. the everyday version vs. the
 * high-friendship "Golden" version).
 */
export interface AnimalProductQuality {
  /**
   * The quality tier's unique identifier.
   */
  id: string;

  /**
   * The quality tier's name (e.g. "Chicken Egg" or "Golden Egg").
   */
  name: string;

  /**
   * The quality tier, either the everyday version or the "Golden" version.
   */
  tier: 'normal' | 'gold';

  /**
   * Description of this quality tier.
   */
  description: string;

  /**
   * The image representing this quality tier.
   */
  image: string;

  /**
   * The selling price of this quality tier.
   */
  sell: number;

  /**
   * The minimum animal friendship hearts required to obtain this quality
   * tier. Zero for the everyday version.
   */
  'min-hearts': number;

  /**
   * Link to this quality tier's wiki page.
   */
  href: string;
}

/**
 * Represents an animal product (e.g. eggs, milk, fibers) in the game.
 */
export interface AnimalProduct {
  /**
   * The product's unique identifier.
   */
  id: string;

  /**
   * The product's name.
   */
  name: string;

  /**
   * The category of animal product this is.
   */
  category: AnimalProductCategory;

  /**
   * The id of the animal that produces this item, cross-referencing
   * `Animal.id` from `models/animals`. Undefined when the product isn't
   * tied to a specific animal species (e.g. gift beads dropped by any
   * animal).
   */
  animalId?: string;

  /**
   * The gender of animal that produces this item, or 'Any' if either
   * gender can produce it.
   */
  gender: Gender;

  /**
   * The quality tiers this product comes in.
   */
  qualities: AnimalProductQuality[];

  /**
   * Link to the product's wiki page.
   */
  href: string;
}

/**
 * The type of animal (or pet) a cosmetic can be applied to.
 */
export type AnimalCosmeticType = 'alpaca' | 'capybara' | 'chicken' | 'cow' | 'duck' | 'horse' | 'rabbit' | 'sheep' | 'pet' | string;

/**
 * Represents a cosmetic item that can be applied to an animal (or pet).
 */
export interface AnimalCosmetic {
  /**
   * The cosmetic's unique identifier.
   */
  id: string;

  /**
   * The cosmetic's name.
   */
  name: string;

  /**
   * Description of the cosmetic. The wiki does not provide per-item
   * descriptions for cosmetics (only a boilerplate line repeated on every
   * page), so this is left empty when nothing more specific is available.
   */
  description: string;

  /**
   * The image representing the cosmetic.
   */
  image: string;

  /**
   * The type of animal (or pet) this cosmetic can be applied to.
   */
  type: AnimalCosmeticType;

  /**
   * For pet cosmetics, which pet appearances this cosmetic is valid for
   * (e.g. "All" or a specific pet skin). Empty for non-pet cosmetics.
   */
  'pet-appearance': string;

  /**
   * The tesserae cost to buy this cosmetic. Zero if it isn't purchased
   * with tesserae (e.g. seasonal variants or event offerings).
   */
  buy: number;

  /**
   * Free-text description of how this cosmetic is obtained (shop, event,
   * offering, seasonal variant, etc.).
   */
  source: string;

  /**
   * Link to the cosmetic's wiki page.
   */
  href: string;
}
