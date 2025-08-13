// Packages
import {
	UserIcon,
	ClockIcon,
  HomeIcon,
  StarIcon,
} from '@heroicons/react/24/solid';
import {
  useEffect,
  useState,
  type ReactElement,
} from 'react';
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
} from '../../../components/ui/accordion';
import { commaNumber } from '../../../lib/utils';
import { InfoCard } from '../../../components/cards/info-card';

// Types
import type { FieldsOfMistriaIncome } from '../../../types/fields-of-mistria/game-stats';

/**
 * Player overview component props.
 */
export interface PlayerOverviewProps {
  /**
   * Player name
   */
  name?: string,

  /**
   * Farm name
   */
  farmName?: string,

  /**
   * Playtime in seconds
   */
  playtime?: number,

  /**
   * Town renown
   */
  renown?: number,

  /**
   * Total essence
   */
  grossEssence?: number,

  /**
   * Faints
   */
  faints?: number,

  /**
   * Player income
   */
  income?: FieldsOfMistriaIncome[],
}

/**
 * Player page overview component.
 */
export default function PlayerOverview({
  name = 'No Info Found',
  farmName = 'No Info Found',
  playtime = -1,
  renown = -1,
  grossEssence = -1,
  faints = -1,
  income = [] as FieldsOfMistriaIncome[],
}: PlayerOverviewProps): ReactElement {
  const [
    displayPlaytime,
    setDisplayPlaytime,
  ] = useState<string>('No Info Found');
  const [
    grossIncome,
    setGrossIncome,
  ] = useState<string>('No Info Found');

  // Calculate time played.
  useEffect(() => {
    if (playtime === -1) {
      setDisplayPlaytime('No Info Found');
      return;
    }

    const hours = Math.floor(playtime / 60 / 60);
    const minutes = Math.floor((playtime / 60) % 60);
    setDisplayPlaytime(`${hours}h ${minutes}m`);
  }, [ playtime ]);

  // Calculate gross income.
  useEffect(() => {
    if (!income.length) {
      setGrossIncome('No Info Found');
      return;
    }

    const totalIncome = income.reduce((
        acc: number,
        curr: FieldsOfMistriaIncome,
      ) => (acc + curr.amount),
      0,
    );

    setGrossIncome(totalIncome > 0 ? commaNumber(totalIncome) : 'No Info Found');
  }, [ income ]);

  return (
    <>
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
                  description={name}
                  Icon={UserIcon} />

                <InfoCard
                  title='Farm'
                  description={farmName}
                  Icon={HomeIcon} />

                <InfoCard
                  title='Playtime'
                  description={displayPlaytime}
                  Icon={ClockIcon} />

                <InfoCard
                  title='Town Renown'
                  description={renown !== -1 ? commaNumber(renown) : 'No Info Found'}
                  Icon={StarIcon} />

                <InfoCard
                  title='Total Essence'
                  description={grossEssence !== -1 ? commaNumber(grossEssence) : 'No Info Found'}
                  Icon={IconDropletFilled} />

                <InfoCard
                  title='Total Gold'
                  description={grossIncome}
                  Icon={IconCoinFilled} />

                <InfoCard
                  title='Faints'
                  description={faints !== -1 ? commaNumber(faints) : 'No Info Found'}
                  Icon={IconAlarmSnoozeFilled} />
              </div>
            </AccordionContent>
          </AccordionItem>
        </section>
      </Accordion>
    </>
  );
}
