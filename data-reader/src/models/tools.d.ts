/**
 * Represents the tier of a tool.
 *
 * NOTE: the wiki's Tools page also lists a 'mistril' tier above 'gold' for
 * every tool type (e.g. Mistril Pickaxe), so it has been added here.
 */
export type ToolTier = 'worn'
| 'copper'
| 'iron'
| 'silver'
| 'gold'
| 'mistril';

/**
 * Represents the type of tool.
 */
export type ToolType = 'pickaxe'
| 'axe'
| 'hoe'
| 'watering-can'
| 'fishing-rod'
| 'shovel'
| 'bug-net';

/**
 * Represents the type of equipment.
 */
export type EquipmentType = 'helmet'
| 'chestpiece'
| 'pants'
| 'shoes'
| 'ring';

/**
 * Represents the type of cosmetic item.
 */
export type CosmeticType = 'accessories'
| 'clothes'
| 'hairstyles';

/**
 * Represents the sub-type of a cosmetic item.
 */
export type CosmeticSubType = 'head-wear'
| 'glasses'
| 'back-accessory'
| 'top'
| 'bottom'
| 'shoes'
| 'hair'
| 'eyes'
| 'skin-tone';

/**
 * Represents an ingredient required to craft a tool.
 */
export interface ToolIngredient {
  id: string;
  name: string;
  image: string;
  quantity: number;
}

/**
 * Represents a single tool (one entry per tier of a tool type, e.g. "Copper Pickaxe").
 */
export interface Tool {
  id: string;
  name: string;
  description: string;
  image: string;
  type: ToolType;
  tier: ToolTier;
  /**
   * The tool's charge/cast range as displayed on the wiki (e.g. "3x1 Tiles (3 Tiles)"
   * for most tools, or a plain number of tiles for fishing rods). Empty string
   * when the wiki doesn't list one (e.g. Bug Nets).
   */
  chargeRange: string;
  /**
   * Sell price in tesserae. 0 when the wiki doesn't list a sell price.
   */
  sell: number;
  /**
   * Price in tesserae to buy/craft this tool from its source. 0 when uncraftable/unbuyable.
   */
  cost: number;
  /**
   * Whether this tool can be crafted (has a Recipe section on its wiki page).
   */
  craftable: boolean;
  ingredient?: ToolIngredient;
  craftingStation?: string;
  /**
   * Crafting time in minutes.
   */
  craftTime?: number;
  craftingLevel?: number;
  /**
   * Human-readable description of where the tool is obtained (e.g. "Blacksmithing Blacksmith", "Tackle Shop", "Story Quest").
   */
  source: string;
  href: string;
}
