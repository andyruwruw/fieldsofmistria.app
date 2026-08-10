/**
 * The crafting/cooking/forging discipline that an infusion belongs to.
 *
 * Infusions are random bonus effects that can roll onto an item when it is
 * crafted, cooked, or forged (or, for the "Other" category, applied after
 * the fact via a Snake Oil). Each category has its own pool of possible
 * infusions and its own way of biasing/guaranteeing which one you get.
 */
export type InfusionCategory = 'Blacksmithing' | 'Cooking' | 'Woodcrafting' | 'Other';

/**
 * A link to another wiki entity (an item category, a specific item, or a
 * skill perk) referenced from an infusion's row.
 */
export interface InfusionReference {
  /**
   * Display name of the referenced entity.
   */
  name: string;

  /**
   * Link to the referenced entity's wiki page. Empty string if there is
   * nothing to link to (e.g. the "Uncraftable" requirement).
   */
  href: string;

  /**
   * Icon image for the referenced entity. Empty string if none is shown.
   */
  icon: string;
}

/**
 * Represents a single infusion: a bonus effect that can be applied to an
 * item via crafting, cooking, forging, or a Snake Oil.
 */
export interface Infusion {
  /**
   * The infusion's unique identifier (category + name, slugified).
   */
  id: string;

  /**
   * The infusion's display name (e.g. "Fortified", "Fairy", "Fire").
   */
  name: string;

  /**
   * Which discipline this infusion belongs to.
   */
  category: InfusionCategory;

  /**
   * The infusion's icon image.
   */
  image: string;

  /**
   * Description of the bonus effect this infusion grants.
   */
  effect: string;

  /**
   * The category of item this infusion can roll onto (e.g. Equipment,
   * Weapons, Tools, Cooked Dishes, Crafted Items). Null if not specified.
   */
  validItems: InfusionReference | null;

  /**
   * Specific items that always come pre-infused with this infusion.
   */
  preInfusedItems: InfusionReference[];

  /**
   * The skill perk required to be able to roll this infusion, or a plain
   * description (e.g. "Uncraftable") when it isn't tied to a perk.
   */
  requirement: InfusionReference;

  /**
   * Link to the wiki page this infusion was parsed from.
   */
  href: string;
}
