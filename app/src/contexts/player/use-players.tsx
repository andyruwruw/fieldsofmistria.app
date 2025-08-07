// Packages
import { useContext } from 'react';

// Local Imports
import { PlayersContext } from '.';

export const usePlayers = () => {
	return useContext(PlayersContext);
};
