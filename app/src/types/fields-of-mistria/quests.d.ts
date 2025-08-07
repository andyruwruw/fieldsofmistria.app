/* eslint-disable @typescript-eslint/no-explicit-any */
export interface FieldsOfMistriaQuests {
  completed_quests: string[];

  request_board: string[];

  request_board_read_entries: string[];

  completion_timestamps: Record<string, number>;

  blackboard: Record<string, any>;

  active_quests: FieldsOfMistriaQuest[];

  manual_quest_unlocks: any[];
}

export interface FieldsOfMistriaQuest {
  task_id: number;

  quest_name: string;

  blackboard: Record<string, any>;
}

