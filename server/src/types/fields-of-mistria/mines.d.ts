/* eslint-disable @typescript-eslint/no-explicit-any */
export interface FieldsOfMistriaItemCount {
  count: number;

  item: string;
}

export interface FieldsOfMistriaMinesFloor {
  floor_data: FieldsOfMistriaMinesFloorData[];

  current_floor_data: any | null;

  exit_inventory: FieldsOfMistriaItemCount[];

  armor:  string[];

  time_start: number;

  inventory_on_enter: FieldsOfMistriaItemCount[];

  status: string,

  inventory_on_exit: any | null;

  day_entered: number;
  
  ari_inventory_size: number;
}

export interface FieldsOfMistriaMinesFloorData {
  health_on_floor_enter: number;

  health_on_floor_exit: number;

  chest_items_released: any[];

  rock_drops: any[];

  bugs_caught: any[];

  stamina_on_floor_enter: number;

  pickaxe_spawned_bugs: any[];

  whirlpool_uses: number;

  stamina_on_floor_exit: number;

  rocks_broken: any[];

  rocks_spawned: any[];

  bugs_spawned: any[];

  digsites: number;

  fishes_spawned: any[];

  enemy_drops: any[];

  room_name: string;

  enemy_kill: any;

  forageables_harvested: any[];

  forageables_spawned: any[];

  status: string;

  snacks: any[];

  fishing_items: any[];

  current_floor: number;

  debris_items_released: string[];

  time_end: number;

  artifacts: any[];

  damages: FieldsOfMistriaMinesFloorDamages[];

  time_start: number;

  monsters_spawned: string[];
}

export interface FieldsOfMistriaMinesFloorDamages {
  damage_dealt_count: number;

  killed_by_ari: boolean;

  monster: string;

  damage_taken: number;

  damage_taken_count: number;

  damage_dealt: number;
}
