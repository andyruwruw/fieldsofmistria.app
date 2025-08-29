/* eslint-disable @typescript-eslint/no-explicit-any */
export interface FieldsOfMistriaHeader {
  farm_name: string;

  playtime: number;

  calendar_time: number;

  preset: FieldsOfMistriaHeaderPreset;

  clock_time: number;

  name: string;

  stats: FieldsOfMistriaHeaderStats;

  weather: FieldsOfMistriaWeather;
}

export interface FieldsOfMistriaWeather {
  forecast: string[];
}

export interface FieldsOfMistriaHeaderPreset {
  eyes: number;

  assets: FieldsOfMistriaHeaderPresetAsset[];

  skin_tone: number;
}

export interface FieldsOfMistriaHeaderPresetAsset {
  lut_index: number;

  name: string;
}

export interface FieldsOfMistriaHeaderStats {
  renown: number;

  essence: number;

  free_baths: number;

  base_health: number;

  perks_active: FieldsOfMistriaHeaderStatsPerks;

  base_stamina: number;

  status_effects: (any | null)[];

  invulnerable_hits: number;

  end_of_day_status: string;

  ancient_inspiration_time: any | null;

  gold: number;

  stamina_current: number;

  mana_current: number;

  health_current: number;

  mana_max: number;
}

export interface FieldsOfMistriaHeaderStatsPerks {
  forager: boolean;
  waste_not_want_not: boolean;
  copper_expert: boolean;
  iron_expert: boolean;
  time_sensitive: boolean;
  time_sensitive_two: boolean;
  sharp_blacksmithing: boolean;
  fortified_blacksmithing: boolean;
  prepared_picker: boolean;
  aquatic_antiquities: boolean;
  working_with_the_grain: boolean;
  quality_crafting: boolean;
  natural: boolean;
  leech_blacksmithing: boolean;
  lightweight_blacksmithing: boolean;
  stoneturner: boolean;
  eastern_road_scholar: boolean;
  iron_hound: boolean;
  true_blue: boolean;
  treasured: boolean;
  mine_time: boolean;
  quick_footed: boolean;
  generous_in_defeat: boolean;
  shrine_savant: boolean;
  feed_prepper: boolean;
  currency_of_care: boolean;
  gemini_season: boolean;
  museum_quality_one: boolean;
  pursuit: boolean;
  perfect_catch: boolean;
  weedline_watcher: boolean;
  unexpected_haul: boolean;
  speedy_cooking: boolean;
  loveable_cooking: boolean;
  fairy_cooking: boolean;
  hasty_blacksmithing: boolean;
  tireless_blacksmithing: boolean;
  silver_expert: boolean;
  back_in_vogue: boolean;
  time_sensitive_three: boolean;
  empowered: boolean;
  empowered_two: boolean;
  dinner_for_two: boolean;
  a_way_to_the_heart: boolean;
  full_class: boolean;
  time_to_eat_three: boolean;
  wind_down: boolean;
  resonance: boolean;
  natural_beauty: boolean;
  well_placed: boolean;
  museum_quality_two: boolean;
  perfect_prefix: boolean;
  rocking: boolean;
  in_motion: boolean;
  out_of_juice: boolean;
  material_world: boolean;
  steady_supplies: boolean;
  set_pieces: boolean;
  hammer_timing_three: boolean;
  living_off_the_land: boolean;
  superb_sower: boolean;
  harvest_time: boolean;
  prize_winning: boolean;
  treasure_trove: boolean;
  weedline_watcher_two: boolean;
  earth_breaker_two: boolean;
  silver_seeker: boolean;
  fantastic_finds: boolean;
  currency_of_care_two: boolean;
  currency_of_care_three: boolean;
  discount_treats: boolean;
  barnyard_bounty_two: boolean;
  ancient_inspiration: boolean;
  underground_inspiration: boolean;
  deliberate_debris: boolean;
  snacktime: boolean;
  caffeine_crimes: boolean;
  appealing_reeling_two: boolean;
  frenzy: boolean;
  what_a_catch: boolean;
  the_bell_tolls: boolean;
  maximum_milling: boolean;
  barnyard_bounty_three: boolean;
  sickle_sword: boolean;
  ornamental: boolean;
  perfect_pollinators: boolean;
  lost_to_history: boolean;
  former_farmers: boolean;
  horsepower: boolean;
  harvest_horse: boolean;
  nice_ride: boolean;
  museum_quality_three: boolean;
  sonic_boom: boolean;
  gift_exchange: boolean;
  mist_sight: boolean;
  earthly_essence: boolean;
  taste_maker: boolean;
  abyssal_ascendence: boolean;
  playtime_one: boolean;
  gold_expert: boolean;
  time_sensitive_four: boolean;
  back_in_vogue_two: boolean;
  magical_meals: boolean;
  good_as_gold: boolean;
  refined_rockery: boolean;
  break_one_get_two: boolean;
  lucky_haul_two: boolean;
  lumberjack_two: boolean;
  magic_design: boolean;
  natural_beauty_two: boolean;
  guardians_shield_two: boolean;
  true_strike_two: boolean;
  working_with_the_grain_two: boolean;
  legendary: boolean;
  a_day_well_spent: boolean;
  feeding_frenzy: boolean;
  barnyard_bounty: boolean;
  appealing_reeling: boolean;
  catch_of_the_day: boolean;
  close_bond: boolean;
  welcome_home: boolean;
  welcome_home_two: boolean;
  green_thumb: boolean;
  nice_swing: boolean;
  refreshing: boolean;
  sunken_treasure: boolean;
  sunken_secrets: boolean;
  unpeatable: boolean;
  western_ruins_scholar: boolean;
  guardians_shield: boolean;
  jump_attack: boolean;
  dungeon_delicacies: boolean;
  true_strike: boolean;
  ore_riginal: boolean;
  earth_breaker: boolean;
  well_armed: boolean;
  reclaimer: boolean;
  treasure_hunter: boolean;
  bountiful: boolean;
  heavy_duty: boolean;
  well_watered: boolean;
  school_crasher: boolean;
  lucky_haul: boolean;
  restorative_cooking: boolean;
  seasoned: boolean;
  time_to_eat: boolean;
  time_to_eat_two: boolean;
  award_winning: boolean;
  likable_cooking: boolean;
  hammer_timing: boolean;
  hammer_timing_two: boolean;
  lumberjack: boolean;
  masonry: boolean;
}
