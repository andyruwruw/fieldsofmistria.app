/**
 * Represents a single crafting ingredient required for a piece of furniture.
 */
export interface FurnitureIngredient {
  /**
   * Unique identifier for the ingredient.
   */
  id: string;

  /**
   * Name of the ingredient.
   */
  name: string;

  /**
   * Link to the ingredient's wiki page.
   */
  href: string;

  /**
   * Quantity of the ingredient required.
   */
  quantity: number;
}

/**
 * Represents a single color/style variant of a furniture item, as shown in the
 * item's on-page image tabs (e.g. "Blue", "Red-brown", "Green" for a Moon Gate).
 */
export interface FurnitureVariant {
  /**
   * The variant's tab label (e.g. "Blue"). Empty string if the item has no variants.
   */
  label: string;

  /**
   * The variant's full display name (e.g. "Moon Gate (Blue)").
   */
  name: string;

  /**
   * The variant's image.
   */
  image: string;

  /**
   * The variant's descriptive caption.
   */
  description: string;

  /**
   * The variant's sell price, in tesserae.
   */
  sell: number;
}

/**
 * Represents a piece of furniture in the game.
 */
export interface Furniture {
  /**
   * Unique identifier for the furniture item.
   */
  id: string;

  /**
   * Name of the furniture item.
   */
  name: string;

  /**
   * Description of the furniture item (from its default variant's caption).
   */
  description: string;

  /**
   * The furniture item's main image (from its default variant).
   */
  image: string;

  /**
   * The furniture category (e.g. "Seating", "Lighting", "Farm & Outdoor").
   */
  category: string;

  /**
   * The furniture sub category, if any (e.g. "Dining Chairs", "Nightstands").
   */
  subcategory: string;

  /**
   * The furniture set this item belongs to (e.g. "Basic Furniture Set", "Other").
   */
  set: string;

  /**
   * Sell price of the furniture item, in tesserae.
   */
  sell: number;

  /**
   * How this item can be obtained (e.g. "Woodcrafting", "Museum").
   */
  sources: string[];

  /**
   * A description of where the crafting recipe for this item is obtained.
   */
  recipeSource: string;

  /**
   * Crafting materials required to make this item, if craftable.
   */
  ingredients: FurnitureIngredient[];

  /**
   * Time required to craft this item, in minutes.
   */
  craftTime: number;

  /**
   * Woodcrafting skill level required to craft this item.
   */
  craftingLevel: number;

  /**
   * The item's color/style variants.
   */
  variants: FurnitureVariant[];

  /**
   * Any additional, less common infobox fields captured for this item
   * (e.g. "Storage Capacity" for chests), keyed by their label.
   */
  extra: Record<string, string>;

  /**
   * Link to the furniture item's wiki page.
   */
  href: string;
}
