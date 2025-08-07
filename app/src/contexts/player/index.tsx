/* eslint-disable @typescript-eslint/no-unused-vars */
// Packages
import { createContext } from 'react';

// Types
import type {
  FieldsOfMistriaGameData,
  FieldsOfMistriaInfo,
  FieldsOfMistriaSaveData,
} from '../../types/fields-of-mistria';
import type { FieldsOfMistriaLocationData } from '../../types/fields-of-mistria/locations';
import type { FieldsOfMistriaGameStats } from '../../types/fields-of-mistria/game-stats';
import type { FieldsOfMistriaQuests } from '../../types/fields-of-mistria/quests';
import type { FieldsOfMistriaPlayer } from '../../types/fields-of-mistria/player';
import type { FieldsOfMistriaHeader } from '../../types/fields-of-mistria/header';
import type { FieldsOfMistriaNpcs } from '../../types/fields-of-mistria/characters';

interface PlayersContextProps {
	locations: Record<string, FieldsOfMistriaLocationData>;

  data: FieldsOfMistriaGameData;

  stats: FieldsOfMistriaGameStats;

  header: FieldsOfMistriaHeader;

  info: FieldsOfMistriaInfo;

  npcs: FieldsOfMistriaNpcs;

  player: FieldsOfMistriaPlayer;

  quests: FieldsOfMistriaQuests;

  unpackSave: (save: File) => Promise<void>;
}

export const PlayersContext = createContext<PlayersContextProps>({
  locations: {},
  data: {} as FieldsOfMistriaGameData,
  stats: {} as FieldsOfMistriaGameStats,
  header: {} as FieldsOfMistriaHeader,
  info: {} as FieldsOfMistriaInfo,
  npcs: {} as FieldsOfMistriaNpcs,
  player: {} as FieldsOfMistriaPlayer,
  quests: {} as FieldsOfMistriaQuests,
  unpackSave: (save: File) => Promise.resolve(),
});
