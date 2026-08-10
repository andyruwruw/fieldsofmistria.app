/**
 * A single image shown in a location's infobox gallery (e.g. seasonal
 * exterior shots, interior shots, map placement).
 */
export interface LocationImage {
  /**
   * Absolute URL of the image.
   */
  src: string;

  /**
   * Alt text for the image, usually the source filename.
   */
  alt: string;

  /**
   * Caption text shown under the image, if any.
   */
  caption: string;
}

/**
 * A link to another wiki page referenced from a location's infobox (e.g.
 * the region/parent location it belongs to).
 */
export interface LocationLink {
  /**
   * Display name of the linked page.
   */
  name: string;

  /**
   * Slug id of the linked page, derived from its display name.
   */
  id: string;

  /**
   * Absolute URL of the linked page, empty if the row has no link
   * (e.g. plain text, or a self-link back to the current page).
   */
  href: string;
}

/**
 * An NPC, animal, or other entity that resides at a location.
 */
export interface LocationResident {
  /**
   * Display name of the resident, including any parenthetical note
   * (e.g. "Farm Animals (conditional)").
   */
  name: string;

  /**
   * Slug id derived from the resident's display name.
   */
  id: string;

  /**
   * Absolute URL of the resident's wiki page, empty if unlinked
   * (e.g. lore-only characters with no page of their own).
   */
  href: string;
}

/**
 * An unlock/upgrade requirement for a location (e.g. a story quest that
 * must be completed).
 */
export interface LocationRequirement {
  /**
   * Full requirement text as shown on the page (e.g. `Story Quest "Unlocking The Mines"`).
   */
  text: string;

  /**
   * Absolute URL of the linked quest/page, if any.
   */
  href: string;
}

/**
 * Represents a location in the game, as scraped from its wiki page's
 * `div.druid-infobox`.
 */
export interface Location {
  /**
   * Unique identifier for the location.
   */
  id: string;

  /**
   * Name of the location.
   */
  name: string;

  /**
   * Wiki page URL for the location.
   */
  href: string;

  /**
   * The lead descriptive paragraph from the page, if any.
   */
  description: string;

  /**
   * Primary image for the location (the first infobox image), empty if none.
   */
  image: string;

  /**
   * All images shown in the location's infobox gallery.
   */
  images: LocationImage[];

  /**
   * The region/parent location this location belongs to (the infobox's
   * "Location" row), null if the page has no infobox.
   */
  region: LocationLink | null;

  /**
   * Location type(s) (e.g. "Region", "Store", "Residence", "Quest Hub").
   */
  types: string[];

  /**
   * NPCs, animals, or other entities found at this location.
   */
  residents: LocationResident[];

  /**
   * Requirement to unlock/access the location, null if available from the start
   * or not applicable.
   */
  unlock: LocationRequirement | null;

  /**
   * Requirement to upgrade the location, null if not applicable.
   */
  upgrade: LocationRequirement | null;

  /**
   * The location's musical/decor theme, if listed.
   */
  theme: string;

  /**
   * Catch-all for infrequent infobox rows that don't warrant their own
   * field (e.g. "Floors", "To Progress" on Mines sub-areas).
   */
  extra: Record<string, string>;
}
