/* eslint-disable @typescript-eslint/no-explicit-any */
export interface FieldsOfMistriaPlayer {
  skill_xp: FieldsOfMistriaPlayerSkillXp;

  tutorials_seen: string[];

  mount: FieldsOfMistriaMount;

  items_acquired: string[];

  quest_artifacts: FieldsOfMistriaQuestArtifacts;

  items_sold: Record<string, number>;

  birthday: number;

  animal_cosmetic_unlocks: Record<string, string[]>;

  armour: FieldsOfMistriaPlayerArmour[];

  secret_beach: number;

  secret_narrows: number;

  seen_cosmetics: string[];

  farm_name: string;

  cosmetic_unlocks: string[];

  pinned_spell: string;

  festival_date_partner: null;

  progression: string[];

  animal_variant_unlocks: Record<string, string[]>;

  spells_learned: string[];

  legendary_fish_caught: any[];

  date_history: any[];

  position: number[];

  floorings: Record<string, FieldsOfMistriaFlooring>;

  date_unlocks: any[];

  has_gossiped_today: boolean;

  has_left_house_today: boolean;

  renown_reward_inventory: FieldsOfMistriaInventoryData[];

  annual_index_purchase_bans: any[];

  pronouns: Record<string, string>;

  name: string;

  pending_renown_entries: any[];

  home_location: string;

  has_seen_ritual_level_today: boolean;

  has_seen_treasure_level_today: boolean;

  ate_soup: boolean;

  crown_cooldown: number;

  upper_floor: boolean;

  inbox: FieldsOfMistriaInboxItem[];

  world_fountains: any[];

  preset_index_selected: number;

  wallpapers: Record<string, FieldsOfMistriaWallpaper>;

  perks: string[];

  stats: FieldsOfMistriaHeaderStats;

  presets: FieldsOfMistriaHeaderPreset[];

  recipe_unlocks: string[];

  recipes_created: any[];

  size_upgrade: string;

  inventory: FieldsOfMistriaInventoriesData;

  used_wishing_well: boolean;

  pet_cosmetic_sets_unlocked: any[];

  morning_recipe_unlocks: string[];
}

export interface FieldsOfMistriaWallpaper {
  door_modl_sprite: string;

  wallpaper: string;

  infusion: any | null;
}

export interface FieldsOfMistriaInboxItem {
  ready: boolean;

  items_taken: boolean;

  path: string;
}

export interface FieldsOfMistriaFlooring {
  flooring: string;

  infusion: any | null;
}

export interface FieldsOfMistriaPlayerSkillXp {
  fishing: number;

  archaeology: number;

  cooking: number;

  mining: number;

  combat: number;

  blacksmithing: number;

  farming: number;

  woodcrafting: number;

  ranching: number;
}

export interface FieldsOfMistriaMount {
  cosmetic: any | null;

  kind: string;

  sex: string;

  variant: string;

  name: string;
}

export interface FieldsOfMistriaQuestArtifacts {
  [key: string]: FieldsOfMistriaQuestArtifact;
}

export interface FieldsOfMistriaQuestArtifact {
  last_tier: number;

  max_score: number;

  last_score: number;
}
