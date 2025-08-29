/* eslint-disable @typescript-eslint/no-explicit-any */
export interface FieldsOfMistriaGameDataSeals {
  fire: FieldsOfMistriaGameDataSeal[];

  ruins: FieldsOfMistriaGameDataSeal[];

  earth: FieldsOfMistriaGameDataSeal[];

  water: FieldsOfMistriaGameDataSeal[];
}

export interface FieldsOfMistriaGameDataSeal {
  required_tags: any[],
  
  count: number;

  item: FieldsOfMistriaInventoryItemData | null;
}
