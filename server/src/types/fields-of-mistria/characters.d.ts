/* eslint-disable @typescript-eslint/no-explicit-any */
export interface FieldsOfMistriaPetData {
  items_to_pop: any[];

  cosmetic: any | null;

  has_eaten: boolean;

  sex: string;

  variant: string;

  name: string;

  has_been_pat: boolean;

  heart_points: number;

  job: string;
}

export type FieldsOfMistriaConversation = `${string}/${string}/${string}/${string}/${string}`

export interface FieldsOfMistriaAnimal {
  source: string;

  animal_kind: string;

  sex: string;

  variant: string;

  day: number;

  cost: number;

  idx: number;
}

export interface FieldsOfMistriaNpcs {
  [key: string]: FieldsOfMistriaNpcData;
}

export interface FieldsOfMistriaNpcData {
  current_routine: any | null;

  outfit: string;

  known_gift_preferences: string[];
  
  schedule_name: string;

  animation: string;

  simulated_distance_traveled: number;

  times_spoken_today: number;

  location_position: FieldsOfMistriaNpcDataLocation;

  heart_points: number;

  current_activity: any | null;

  gift_flag: boolean;

  talk_flag: boolean;

  gifts_given: string[];

  had_arrived: boolean;

  cardinality: string;
}

export interface FieldsOfMistriaNpcDataLocation {
  location_id: string;

  dyn_index: any | null;

  pos: {
    x: number;
    y: number;
  };
}