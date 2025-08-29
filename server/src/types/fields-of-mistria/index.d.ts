/* eslint-disable @typescript-eslint/no-explicit-any */
export interface FieldsOfMistriaSaveData {
  beach: FieldsOfMistriaLocationData;

  beach_secret: FieldsOfMistriaLocationData;
  
  checksums: FieldsOfMistriaChecksumsData;

  date_photos: FieldsOfMistriaDatePhotosData;

  deep_woods: FieldsOfMistriaLocationData;

  dragonsworn_glade: FieldsOfMistriaLocationData;

  [`DynamicGrid_${number}`]: FieldsOfMistriaLocationData;

  earth_seal: FieldsOfMistriaLocationData;

  eastern_road: FieldsOfMistriaLocationData;

  farm: FieldsOfMistriaLocationData;

  fire_seal: FieldsOfMistriaLocationData;

  gamedata: FieldsOfMistriaGameData;

  game_stats: FieldsOfMistriaGameStats;

  haydens_farm: FieldsOfMistriaLocationData;

  header: FieldsOfMistriaHeader;

  info: FieldsOfMistriaInfo;

  mines_entry: FieldsOfMistriaLocationData;

  narrows: FieldsOfMistriaLocationData;

  narrows_secret: FieldsOfMistriaLocationData;

  npcs: FieldsOfMistriaNpcs;

  player: FieldsOfMistriaPlayer;

  player_home: FieldsOfMistriaLocationData;

  player_home_east: FieldsOfMistriaLocationData;

  player_home_north: FieldsOfMistriaLocationData;

  player_home_upper_central: FieldsOfMistriaLocationData;

  player_home_upper_east: FieldsOfMistriaLocationData;

  player_home_upper_west: FieldsOfMistriaLocationData;

  player_home_west: FieldsOfMistriaLocationData;

  quests: FieldsOfMistriaQuests;

  ruins_seal: FieldsOfMistriaLocationData;

  summit: FieldsOfMistriaLocationData;

  town: FieldsOfMistriaLocationData;

  water_seal: FieldsOfMistriaLocationData;

  western_ruins: FieldsOfMistriaLocationData;
}

export interface FieldsOfMistriaInfo {
  version: FieldsOfMistriaInfoVersion

  creation_version: FieldsOfMistriaInfoVersion;

  last_played: number;
}

export interface FieldsOfMistriaInfoVersion {
  minor: number;

  major: number;

  patch: number;

  pre: any | null;
}

export interface FieldsOfMistriaChecksumsData {
  eastern_road: number;

  earth_seal: number;

  player_home_east: number;

  deep_woods: number;

  quests: number;

  dragonsworn_glade: number;

  beach: number;

  ruins_seal: number;

  info: number;

  farm: number;

  date_photos: number;

  town: number;

  player_home_west: number;

  header: number;

  water_seal: number;

  beach_secret: number;

  haydens_farm: number;

  mines_entry: number;

  player_home: number;

  DynamicGrid_1: number;

  gamedata: number;

  fire_seal: number;

  player_home_north: number;

  summit: number;

  player_home_upper_east: number;

  DynamicGrid_0: number;

  player: number;

  npcs: number;

  player_home_upper_central: number;

  player_home_upper_west: number;

  narrows: number;

  narrows_secret: number;

  western_ruins: number;

  game_stats: number;
}

export interface FieldsOfMistriaDatePhotosData {
  photos: any[];
}

export interface FieldsOfMistriaGameData {
  museum_progress: string[];

  clock: number;

  seals: FieldsOfMistriaGameDataSeals;

  t2_expirator: string;

  weather: FieldsOfMistriaGameDataWeather;

  day_time_speed: string;

  lost_items: FieldsOfMistriaLostItems;

  playtime: number;

  t2_world_facts: FieldsOfMistriaWorldFacts;

  maximum_mines_level: number;

  pending_day_time_speed_change: any | null;

  daycare: any[];

  story_enabled: boolean;

  all_unlocks: boolean;

  scene_history: string[];

  farm_expanded: boolean;

  scenes_played_today: string[];

  props: Record<string, any[]>;

  dir: any | null;

  random_seed: string;

  building_modifier_status: Record<string, string>;

  pet: FieldsOfMistriaPetData;

  active_mist_sight: any | null;

  saturday_market_vendors: any[];

  date: number;

  dynamic_grid_count: number;
}

export interface FieldsOfMistriaWorldFacts {
  [key: string]: any | null | string | number;
}

export interface FieldsOfMistriaGameDataWeather {
  forcast: string[];
}
