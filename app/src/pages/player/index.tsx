// Packages
import {
  useContext,
  useEffect,
  useState,
  type ReactElement,
} from 'react';
import {
	UserIcon,
	ClockIcon,
  HomeIcon,
  StarIcon,
} from '@heroicons/react/24/solid';
import {
  IconDropletFilled,
  IconCoinFilled,
  IconAlarmSnoozeFilled,
} from '@tabler/icons-react';

// Local Imports
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '../../components/ui/accordion';
import { PlayersContext } from '../../contexts/player';
import { commaNumber } from '../../lib/utils';
import { InfoCard } from '../../components/cards/info-card';

/**
 * Player page component.
 */
export default function Player(): ReactElement {
  const {
    header,
    stats
  } = useContext(PlayersContext);

  const [
    display,
    setDisplay,
  ] = useState<Record<string, string>>({
    name: 'No Info Found',
    farmName: 'No Info Found',
    playtime: 'No Info Found',
    renown: 'No Info Found',
    grossEssence: 'No Info Found',
    faints: 'No Info Found',
    grossGold: 'No Info Found',
  });

  useEffect(() => {
    const newDisplay: Record<string, string> = {
      name: 'No Info Found',
      farmName: 'No Info Found',
      playtime: 'No Info Found',
      renown: 'No Info Found',
      grossEssence: 'No Info Found',
      faints: 'No Info Found',
      grossGold: 'No Info Found',
    };

    if (header && header.name) {
      newDisplay.name = header.name;
    }

    if (header && header.farm_name) {
      newDisplay.farmName = header.farm_name;
    }

    if (header && header.playtime) {
      const hours = Math.floor(header.playtime / 60 / 60);
      const minutes = Math.floor((header.playtime / 60) % 60);
      newDisplay.playtime = `${hours}h ${minutes}m`;
    }

    if (header && header.stats && header.stats.renown) {
      newDisplay.renown = commaNumber(header.stats.renown);
    }

    if (stats && stats.gross_essence) {
      newDisplay.grossEssence = commaNumber(stats.gross_essence);
    }

    if (stats && stats.faints) {
      newDisplay.faints = commaNumber(stats.faints);
    }

    if (stats && stats.income) {
      let sum = 0;
      for (const income of stats.income) {
        if (income.amount && typeof income.amount === 'number') {
          sum += income.amount;
        }
      }

      newDisplay.grossGold = commaNumber(sum);
    }

    setDisplay(newDisplay);
  }, [
    header,
    stats,
  ]);

  return (
    <>
      <div className='mx-auto mt-4 w-full space-y-4'>
        <Accordion
          type='single'
          collapsible
          defaultValue='item-1'
          asChild>
          <section className='space-y-3'>
            <AccordionItem value='item-1'>
              <AccordionTrigger className='accordion-trigger ml-1 pt-0 text-xl font-semibold text-gray-900 dark:text-white'>
                Player Information
              </AccordionTrigger>

              <AccordionContent>
                <div className='grid grid-cols-2 gap-4 xl:grid-cols-4'>
                  <InfoCard
                    title='Farmer Name'
                    description={display.name}
                    Icon={UserIcon} />

                  <InfoCard
                    title='Farm'
                    description={display.farmName}
                    Icon={HomeIcon} />

                  <InfoCard
                    title='Playtime'
                    description={display.playtime}
                    Icon={ClockIcon} />

                  <InfoCard
                    title='Town Renown'
                    description={display.renown}
                    Icon={StarIcon} />

                  <InfoCard
                    title='Total Essence'
                    description={display.grossEssence}
                    Icon={IconDropletFilled} />

                  <InfoCard
                    title='Total Gold'
                    description={display.grossGold}
                    Icon={IconCoinFilled} />

                  <InfoCard
                    title='Faints'
                    description={display.faints}
                    Icon={IconAlarmSnoozeFilled} />
                </div>
              </AccordionContent>
            </AccordionItem>
          </section>
        </Accordion>
      </div>
    </>
  );
}
