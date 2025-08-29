/* eslint-disable @typescript-eslint/no-explicit-any */
export interface FieldsOfMistriaInventoryItemData {
  cosmetic: any | null;

  date_photo: any | null;

  item_id: string;

  auto_use: boolean;

  infusion: any | null;

  inner_item_id: any | null;

  gold_to_gain: any | null;
  
  pet_cosmetic_set_name: any | null;

  animal_cosmetic: any | null;
}

export interface FieldsOfMistriaInventoryData {
  required_tags: string[];

  count: number;

  item: FieldsOfMistriaInventoryItemData | null;
}

export type FieldsOfMistriaInventoriesData = FieldsOfMistriaInventoryData[];

export interface FieldsOfMistriaObjectData {
  hitpoints?: number;

  top_left_x: number;

  top_left_y: number;

  object_id: string;

  has_fruit?: false;

  stage?: number;

  day_count?: number;

  override_protection?: boolean;

  variant_idx?: number;

  fruiting_days?: number;

  artifact_override?: any | null;

  ctx?: number;

  regrow_cycle?: boolean;

  ladder_candidate?: boolean;

  managed_timer?: any | null;

  date_photo?: any | null;

  cardinal_index?: number;

  infusion?: any | null;

  old_terrain?: any | null;

  on?: boolean;

  destructable?: boolean;

  chest_icon?: any | null;

  inventory?: number;

  use_in_crafting?: boolean;

  fence_image_index?: number;

  is_on?: boolean;
}

export interface FieldsOfMistriaLostItems {
  dynamic_lost_items: FieldsOfMistriaLostItem[][];

  eastern_road: FieldsOfMistriaLostItem[];

  beach: FieldsOfMistriaLostItem[];

  western_ruins: FieldsOfMistriaLostItem[];

  deep_woods: FieldsOfMistriaLostItem[];

  farm: FieldsOfMistriaLostItem[];

  general_store_store: FieldsOfMistriaLostItem[];

  haydens_farm: FieldsOfMistriaLostItem[];

  narrows: FieldsOfMistriaLostItem[];
}

export interface FieldsOfMistriaLostItem {
  x: number;

  y: number;

  items: FieldsOfMistriaInventoryItemData[];
}

export interface FieldsOfMistriaPlayerArmour {
  required_tags: string[];

  count: number;

  item: FieldsOfMistriaInventoryItemData | null;
}