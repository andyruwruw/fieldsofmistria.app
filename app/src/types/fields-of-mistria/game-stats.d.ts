export interface FieldsOfMistriaDayLog {
  day: number;
  item: string;
}

export interface FieldsOfMistriaAmountLog {
  day: number;
  amount: number;
}

export interface FieldsOfMistriaTimeLog extends FieldsOfMistriaDayLog {
  hour: number;
  minute: number;
}

export interface FieldsOfMistriaSetCompletion {
  day: number;
  wing: string;
  set: string;
}

export type FieldsOfMistriaConversation = `${string}/${string}/${string}/${string}/${string}`

export interface FieldsOfMistriaGameStats {
  'items_cooked': FieldsOfMistriaDayLog[];
  'items_eaten': FieldsOfMistriaTimeLog[];
  'set_completions': FieldsOfMistriaSetCompletion[];
  faints: number;
  'items_forged': FieldsOfMistriaDayLog[];
  'conversations': Record<FieldsOfMistriaConversation, number>;
  'items_milled': FieldsOfMistriaDayLog[];
  'items_refined': FieldsOfMistriaDayLog[];
  'animal_bead_drops': FieldsOfMistriaAmountLog[];
}