// Packages
import {
  useEffect,
  useMemo,
  useState,
  type CSSProperties,
  type Dispatch,
  type ReactElement,
  type SetStateAction,
} from 'react';

// Local Imports
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '../../../components/ui/accordion';
import { MuseumSetListControls } from './set-list-controls';
import { SetListAccordion } from './set-list-accordion';

// Types
import type {
  MuseumDisplaySet,
  MuseumSet,
  MuseumWing,
} from '../../../types/museum';

/**
 * Props for the MuseumSetList component.
 */
export interface MuseumSetListProps {
  /**
   * List of museum display sets.
   */
  sets: MuseumSet[];

  /**
   * List of museum wings.
   */
  wings: MuseumWing[];

  /**
   * Map of completed sets.
   */
  completedSets?: Record<string, Record<string, boolean>>;

  /**
   * Map of completed items.
   */
  completedItems?: Record<string, boolean>;

  /**
   * Set the dialog open state.
   */
  setIsOpen?: Dispatch<SetStateAction<boolean>>;

  /**
   * Set the selected museum object.
   */
  setObject?: Dispatch<SetStateAction<MuseumDisplaySet | null>>;
};

/**
 * Museum set list component.
 */
export const MuseumSetList = ({
  sets,
  wings,
  completedSets = {},
  completedItems = {},
  setIsOpen = () => {},
  setObject = () => {},
}: MuseumSetListProps): ReactElement => {
  // Controls
  const [
    search,
    setSearch,
  ] = useState('');
  const [
    filter,
    setFilter,
  ] = useState('all');
  const [
    wingOptions,
    setWingOptions,
  ] = useState([{
    value: 'all',
    label: 'All Sets',
  }]);
  const [
    wingFilter,
    setWingFilter,
  ] = useState('all');

  // Sets to show.
  const [
    filteredSets,
    setFilteredSets,
  ] = useState([] as MuseumSet[]);

  // Set wing filter options.
  useMemo(() => {
    setWingOptions([
      {
        value: 'all',
        label: 'All Sets',
      },
      ...wings.map((wing: MuseumWing) => ({
        value: wing.id,
        label: wing.name,
      })),
    ]);
  }, [ wings ]);

  // Generate sets to show.
  useEffect(() => {
    const filtered = sets.filter((set: MuseumSet) => {
      if (wingFilter !== 'all') {
        if (set.wing !== wingFilter) {
          return false;
        }
      }

      if (filter !== '') {
        if (filter === 'completed' && set.wing in completedSets && set.id in completedSets[set.wing] && completedSets?.[set.wing]?.[set.id]) {
          return false;
        }
        if (filter === 'incompleted' && completedSets?.[set.wing]?.[set.id]) {
          return false;
        }
      }

      if (search !== '') {
        if (!(set.name.toLowerCase().includes(search.toLowerCase()))) {
          return false;
        }
      }

      return true;
    });

    setFilteredSets(filtered);
  }, [
    sets,
    wingFilter,
    filter,
    search,
    completedSets,
  ]);

  return (
    <>
      <Accordion
        collapsible
        asChild
        defaultValue='item-1'
        type='single'>
        <section className='space-y-3'>
          <AccordionItem value='item-1'>
            <AccordionTrigger className='ml-1 text-xl font-semibold text-foreground accordion-trigger'>
              All Museum Sets
            </AccordionTrigger>

            <AccordionContent asChild>
              <MuseumSetListControls
                filter={filter}
                setFilter={setFilter}
                wingOptions={wingOptions}
                wingFilter={wingFilter}
                setWingFilter={setWingFilter}
                setSearch={setSearch} />

              <div className='grid grid-cols-1 gap-4 xl:grid-cols-2'>
                {
                  filteredSets.map((
                    set: MuseumSet,
                    index: number,
                  ) => (
                    <SetListAccordion
                      key={`${set.wing}-${set.id}-${index}`}
                      className='slide-in'
                      style={{
                        '--index': index / 3,
                      } as CSSProperties}
                      set={set}
                      completedSets={completedSets}
                      completedItems={completedItems}
                      setIsOpen={setIsOpen}
                      setObject={setObject} />
                  ))
                }
              </div>
            </AccordionContent>
          </AccordionItem>
        </section>
      </Accordion>
    </>
  );
}