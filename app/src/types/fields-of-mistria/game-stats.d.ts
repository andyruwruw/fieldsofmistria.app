/* eslint-disable @typescript-eslint/no-explicit-any */
export interface FieldsOfMistriaGameStatDayLog {
  day: number;

  item: string;
}

export interface FieldsOfMistriaGameStatAmountLog {
  day: number;

  amount: number;
}

export interface FieldsOfMistriaGameStatTimeLog extends FieldsOfMistriaDayLog {
  hour: number;

  minute: number;
}

export interface FieldsOfMistriaGameStatDayCountLog extends FieldsOfMistriaDayLog {
  count: number;
}

export interface FieldsOfMistriaSetCompletion {
  day: number;

  wing: string;

  set: string;
}

export interface FieldsOfMistriaItemsSoldLog {
  income: number;

  count: number;

  item: string;
}

export interface FieldsOfMistriaGiftGivenLog {
  desire: string;

  day: number;

  gift: string;

  npc: string;
}

export interface FieldsOfMistriaAnimalEatsLog {
  source: string;

  day: number;

  item: string;
}

export interface FieldsOfMistriaAnimalEndOfDayStatus {
  pet: number;

  fed: number;

  not_fed: number;

  not_pet: number;

  outside: number;

  day: number;

  inside: number;
}

export interface FieldsOfMistriaGameStats {
  items_cooked: FieldsOfMistriaDayLog[];

  items_eaten: FieldsOfMistriaTimeLog[];

  set_completions: FieldsOfMistriaSetCompletion[];

  faints: number;

  items_forged: FieldsOfMistriaDayLog[];

  conversations: Record<FieldsOfMistriaConversation, number>;

  items_milled: FieldsOfMistriaDayLog[];

  items_refined: FieldsOfMistriaDayLog[];

  animal_bead_drops: FieldsOfMistriaAmountLog[];

  items_sold_each_day: FieldsOfMistriaItemsSoldLog[][];

  npcs_spoken_to: Record<string, number>;

  items_woodcrafted: FieldsOfMistriaDayLog[];

  dives: FieldsOfMistriaDayLog[];

  gifts_given: FieldsOfMistriaGiftGivenLog[];

  animal_eats: FieldsOfMistriaAnimalEatsLog[];

  fish_caught: FieldsOfMistriaDayLog[];

  animal_eod_statuses: FieldsOfMistriaAnimalEndOfDayStatus[];

  fish_missed: number;

  bugs_caught: FieldsOfMistriaDayLog[];

  bugs_missed: number;

  cutscenes_skipped: number;

  menu_opens: Record<string, number>;

  cosmetic_worn: Record<string, boolean>;

  animal_production: FieldsOfMistriaGameStatDayCountLog[];

  furniture_placed: Record<string, number>;

  mines_data: FieldsOfMistriaMinesFloor[];

  load_logs: FieldsOfMistriaLoadLog[];

  progressions: any[];

  animals: FieldsOfMistriaAnimal[];

  renown_level_ups: FieldsOfMistriaRenounLevelUp[];

  wishing_well_uses: FieldsOfMistriaWishingWellUse[];

  manual_saves: number;

  end_of_day_balance: FieldsOfMistriaEndOfDayBalance[];

  end_of_day_stats: FieldsOfMistriaEndOfDayStats[];

  basement_lines: FieldsOfMistriaBasementLine[];

  crop_harvests: FieldsOfMistriaCropHarvest[];

  chicken_statue_uses: any[];

  home_upgrades: any[];

  bathhouse_uses: number;

  digs: FieldsOfMistriaDig[];

  perk_acquirements: FieldsOfMistriaPerkAcquirements[];

  bedtimes: string[];

  forageable_harvests: FieldsOfMistriaForageableHarvest[];

  enemies_killed: number;

  perks: FieldsOfMistriaPerks;

  purchases: FieldsOfMistriaPurchase[];

  death: number;

  location_visits: FieldsOfMistriaLocationVisits;

  income: FieldsOfMistriaIncome[];

  gross_essence: number;

  current_mines_run: any | null;

  tree_harvests: FieldsOfMistriaDayLog[];
}

export interface FieldsOfMistriaIncome {
  amount: number;

  day: number;

  type: string;
}

export interface FieldsOfMistriaLocationVisits {
  aldaria: number;

  bathhouse_bedroom: number;

  bathhouse_bath: number;

  dragonsworn_glade: number;

  player_home_west: number;

  player_home_east: number;

  player_home_north: number;

  landens_house_f2: number;

  mines_entry: number;

  abandoned_mines: number;

  blacksmith_room_left: number;

  blacksmith_room_right: number;

  jo_and_hemlocks_room: number;

  reinas_room: number;

  balors_room: number;

  clinic_f2: number;

  clinic_b1: number;

  farm: number;

  small_coop: number;

  medium_coop: number;

  large_coop: number;

  small_barn: number;

  small_greenhouse: number;

  medium_barn: number;

  large_barn: number;

  large_greenhouse: number;

  errols_bedroom: number;

  haydens_bedroom: number;

  inn: number;

  holt_and_noras_bedroom: number;

  seridias_chamber: number;

  dungeon: number;

  water_seal: number;

  earth_seal: number;

  fire_seal: number;

  ruins_seal: number;

  narrows_secret: number;

  beach_secret: number;

  mill: number;

  abandoned_pit: number;

  adelines_bedroom: number;

  adelines_office: number;

  bathhouse: number;

  bathhouse_change_room: number;

  beach: number;

  blacksmith_store: number;

  caldarus_house: number;

  celines_room: number;

  clinic_f1: number;

  western_ruins: number;

  deep_woods: number;

  dells_bedroom: number;

  town: number;

  eastern_road: number;

  eilands_bedroom: number;

  eilands_office: number;

  elsies_bedroom: number;

  general_store_home: number;

  summit: number;

  general_store_store: number;

  haydens_farm: number;

  haydens_house: number;

  landens_house_f1: number;

  lucs_room: number;

  player_home: number;

  manor_house_dining_room: number;

  manor_house_entry: number;

  maples_room: number;

  player_home_upper_central: number;

  museum_entry: number;

  player_home_upper_east: number;

  player_home_upper_west: number;

  narrows: number;

  terithias_house: number;
}

export interface FieldsOfMistriaPurchase {
  day: number;

  type: string;

  item: string;

  cost: number;
}

export interface FieldsOfMistriaPerks {
  forager: number;

  waste_not_want_not: number;

  copper_expert: number;

  iron_expert: number;

  time_sensitive: number;

  time_sensitive_two: number;

  sharp_blacksmithing: number;

  fortified_blacksmithing: number;

  prepared_picker: number;

  aquatic_antiquities: number;

  working_with_the_grain: number;

  quality_crafting: number;

  natural: number;

  leech_blacksmithing: number;

  lightweight_blacksmithing: number;

  stoneturner: number;

  eastern_road_scholar: number;

  iron_hound: number;

  true_blue: number;

  treasured: number;

  mine_time: number;

  quick_footed: number;

  generous_in_defeat: number;

  shrine_savant: number;

  feed_prepper: number;

  currency_of_care: number;

  gemini_season: number;

  museum_quality_one: number;

  pursuit: number;

  perfect_catch: number;

  weedline_watcher: number;

  unexpected_haul: number;

  speedy_cooking: number;

  loveable_cooking: number;

  fairy_cooking: number;

  hasty_blacksmithing: number;

  tireless_blacksmithing: number;

  silver_expert: number;

  back_in_vogue: number;

  time_sensitive_three: number;

  empowered: number;

  empowered_two: number;

  dinner_for_two: number;

  a_way_to_the_heart: number;

  full_class: number;

  time_to_eat_three: number;

  wind_down: number;

  resonance: number;

  natural_beauty: number;

  well_placed: number;

  museum_quality_two: number;

  perfect_prefix: number;

  rocking: number;

  in_motion: number;

  out_of_juice: number;

  material_world: number;

  steady_supplies: number;

  set_pieces: number;

  hammer_timing_three: number;

  living_off_the_land: number;

  superb_sower: number;

  harvest_time: number;

  prize_winning: number;

  treasure_trove: number;

  weedline_watcher_two: number;

  earth_breaker_two: number;

  silver_seeker: number;

  fantastic_finds: number;

  currency_of_care_two: number;

  currency_of_care_three: number;

  discount_treats: number;

  barnyard_bounty_two: number;

  ancient_inspiration: number;

  underground_inspiration: number;

  deliberate_debris: number;

  snacktime: number;

  caffeine_crimes: number;

  appealing_reeling_two: number;

  frenzy: number;

  what_a_catch: number;

  the_bell_tolls: number;

  maximum_milling: number;

  barnyard_bounty_three: number;

  sickle_sword: number;

  ornamental: number;

  perfect_pollinators: number;

  lost_to_history: number;

  former_farmers: number;

  horsepower: number;

  harvest_horse: number;

  nice_ride: number;

  museum_quality_three: number;

  sonic_boom: number;

  gift_exchange: number;

  mist_sight: number;

  earthly_essence: number;

  taste_maker: number;

  abyssal_ascendence: number;

  playtime_one: number;

  gold_expert: number;

  time_sensitive_four: number;

  back_in_vogue_two: number;

  magical_meals: number;

  good_as_gold: number;

  refined_rockery: number;

  break_one_get_two: number;

  lucky_haul_two: number;

  lumberjack_two: number;

  magic_design: number;

  natural_beauty_two: number;

  guardians_shield_two: number;

  true_strike_two: number;

  working_with_the_grain_two: number;

  legendary: number;

  a_day_well_spent: number;

  feeding_frenzy: number;

  barnyard_bounty: number;

  appealing_reeling: number;

  catch_of_the_day: number;

  close_bond: number;

  welcome_home: number;

  welcome_home_two: number;

  green_thumb: number;

  nice_swing: number;

  refreshing: number;

  sunken_treasure: number;

  sunken_secrets: number;

  unpeatable: number;

  western_ruins_scholar: number;

  guardians_shield: number;

  jump_attack: number;

  dungeon_delicacies: number;

  true_strike: number;

  ore_riginal: number;

  earth_breaker: number;

  well_armed: number;

  reclaimer: number;

  treasure_hunter: number;

  bountiful: number;

  heavy_duty: number;

  well_watered: number;

  school_crasher: number;

  lucky_haul: number;

  restorative_cooking: number;

  seasoned: number;

  time_to_eat: number;

  time_to_eat_two: number;

  award_winning: number;

  likable_cooking: number;

  hammer_timing: number;

  hammer_timing_two: number;

  lumberjack: number;

  masonry: number;
}

export interface FieldsOfMistriaForageableHarvest {
  day: number;

  forageable: string;
}

export interface FieldsOfMistriaPerkAcquirements {
  day: number;

  perk: string;
}

export interface FieldsOfMistriaDig {
  item_id: string;

  day: number;
}

export interface FieldsOfMistriaCropHarvest {
  crop: string;

  day: number;
}

export interface FieldsOfMistriaBasementLine {
  day: number;

  hour: number;

  position: string;

  minute: number;

  npc: string;
}

export interface FieldsOfMistriaLoadLog {
  version: string;

  day: number;
}

export interface FieldsOfMistriaRenounLevelUp {
  level: number;

  day: number;
}

export interface FieldsOfMistriaWishingWellUse {
  day: number;

  cost: number;

  prize: string;
}

export interface FieldsOfMistriaEndOfDayBalance {
  day: number;

  balance: number;
}

export interface FieldsOfMistriaEndOfDayStats {
  stamina: number;

  health: number;
}