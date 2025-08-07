 
// Packages
import {
  useState,
  type ReactNode,
} from 'react';
import axios from 'axios';

// Local Imports
import { PlayersContext } from '.';

// Types
import type {
  FieldsOfMistriaGameData,
  FieldsOfMistriaInfo,
  FieldsOfMistriaSaveData,
} from '../../types/fields-of-mistria';
import type { FieldsOfMistriaGameStats } from '../../types/fields-of-mistria/game-stats';
import type { FieldsOfMistriaQuests } from '../../types/fields-of-mistria/quests';
import type { FieldsOfMistriaPlayer } from '../../types/fields-of-mistria/player';
import type { FieldsOfMistriaHeader } from '../../types/fields-of-mistria/header';
import type { FieldsOfMistriaNpcs } from '../../types/fields-of-mistria/characters';
import type { FieldsOfMistriaLocationData } from '../../types/fields-of-mistria/locations';


export const PlayersProvider = ({ children }: { children: ReactNode }) => {
  const [
    locations,
    setLocations,
  ] = useState({} as Record<string, FieldsOfMistriaLocationData>);
  const [
    data,
    setData,
  ] = useState({} as FieldsOfMistriaGameData);
  const [
    stats,
    setStats,
  ] = useState({} as FieldsOfMistriaGameStats);
  const [
    header,
    setHeader,
  ] = useState({} as FieldsOfMistriaHeader);
  const [
    info,
    setInfo,
  ] = useState({} as FieldsOfMistriaInfo);
  const [
    npcs,
    setNpcs,
  ] = useState({} as FieldsOfMistriaNpcs);
  const [
    player,
    setPlayer,
  ] = useState({} as FieldsOfMistriaPlayer);
  const [
    quests,
    setQuests,
  ] = useState({} as FieldsOfMistriaQuests);

  /**
   * Get the locations from the save data.
   * @param {FieldsOfMistriaSaveData} data - The save data to extract locations from.
   * @returns {Record<string, FieldsOfMistriaLocationData>} The extracted locations.
   */
  const getLocations = (data: FieldsOfMistriaSaveData) => {
    const locations = {
      beach: data.beach,
      beach_secret: data.beach_secret,
      deep_woods: data.deep_woods,
      dragonsworn_glade: data.dragonsworn_glade,
      earth_seal: data.earth_seal,
      eastern_road: data.eastern_road,
      farm: data.farm,
      fire_seal: data.fire_seal,
      haydens_farm: data.haydens_farm,
      mines_entry: data.mines_entry,
      narrows: data.narrows,
      narrows_secret: data.narrows_secret,
      player_home: data.player_home,
      player_home_east: data.player_home_east,
      player_home_north: data.player_home_north,
      player_home_upper_central: data.player_home_upper_central,
      player_home_upper_east: data.player_home_upper_east,
      player_home_upper_west: data.player_home_upper_west,
      player_home_west: data.player_home_west,
      ruins_seal: data.ruins_seal,
      summit: data.summit,
      town: data.town,
      water_seal: data.water_seal,
      western_ruins: data.western_ruins,
    } as Record<string, FieldsOfMistriaLocationData>;

    for (const key of Object.keys(data)) {
      const DYNAMIC_GRID_REGEX = /^DynamicGrid_(\d+)$/;
      const match = key.match(DYNAMIC_GRID_REGEX);

      if (match) {
        locations[key] = data[key as keyof FieldsOfMistriaSaveData] as FieldsOfMistriaLocationData;
      }
    }

    return locations;
  }

  /**
   * Unpack a save file.
   * @param {File} save - The save file to unpack.
   * @returns {Promise<void>} A promise that resolves when the save is unpacked.
   */
  const unpackSave = async (save: File): Promise<void> => {
    const form = new FormData();
    form.append(
      'file',
      save,
    );

    const response = await axios.post(
      'http://localhost:3000/saves',
      form,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      },
    );

    if (response.status === 200) {
      const unpackedData = response.data as FieldsOfMistriaSaveData;

      setLocations(getLocations(unpackedData));
      setData(unpackedData.gamedata);
      setStats(unpackedData.game_stats);
      setHeader(unpackedData.header);
      setInfo(unpackedData.info);
      setNpcs(unpackedData.npcs);
      setPlayer(unpackedData.player);
      setQuests(unpackedData.quests);
    }
  };

	return (
		<PlayersContext.Provider
			value={{
        locations,
        data,
        stats,
        header,
        info,
        npcs,
        player,
        quests,
        unpackSave,
      }}>
			{children}
		</PlayersContext.Provider>
	);
};
