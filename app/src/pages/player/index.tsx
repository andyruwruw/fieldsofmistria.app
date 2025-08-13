// Packages
import {
  useContext,
  type ReactElement,
} from 'react';

// Local Imports
import { PlayerOverview } from './components/overview';
import { PlayersContext } from '../../contexts/player';

/**
 * Player page component.
 */
export default function Player(): ReactElement {
  const {
    header,
    stats
  } = useContext(PlayersContext);

  return (
    <>
      <div className='mx-auto mt-4 w-full space-y-4'>
        <PlayerOverview
          name={header && 'name' in header ? header.name : undefined}
          farmName={header && 'farm_name' in header ? header.farm_name : undefined}
          playtime={header && 'playtime' in header ? header.playtime : undefined}
          renown={header && 'stats' in header && 'renown' in header.stats ? header.stats.renown : undefined}
          grossEssence={stats && 'gross_essence' in stats ? stats.gross_essence : undefined}
          faints={stats && 'faints' in stats ? stats.faints : undefined}
          income={stats && 'income' in stats ? stats.income : undefined} />
      </div>
    </>
  );
}
