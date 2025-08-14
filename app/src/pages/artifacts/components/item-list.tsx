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
import { ArtifactsItemListControls } from './set-list-controls';
import { SetListAccordion } from './set-list-accordion';

// Types
import type {
  Artifact,
  MuseumDisplaySet,
  MuseumSet,
  MuseumWing,
} from '../../../types/museum';

/**
 * Props for the ArtifactsItemList component.
 */
export interface ArtifactsItemListProps {
  /**
   * List of artifacts.
   */
  artifacts: Artifact[];
  
  /**
   * List of museum display sets.
   */
  sets: MuseumSet[];

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
export const ArtifactsItemList = ({
  artifacts = [],
  sets = [],
  completedItems = {},
  setIsOpen = () => {},
  setObject = () => {},
}: ArtifactsItemListProps): ReactElement => {
  // Controls
  const [
    search,
    setSearch,
  ] = useState('');
  const [
    setOptions,
    setSetOptions,
  ] = useState([{
    value: 'all',
    label: 'All Sets',
  }]);
  const [
    filter,
    setFilter,
  ] = useState('all');

  // Sets to show.
  const [
    filteredItems,
    setFilteredItems,
  ] = useState([] as MuseumSet[]);

  // Set wing filter options.
  useMemo(() => {
    setSetOptions([
      {
        value: 'all',
        label: 'All Sets',
      },
      ...sets.map((set: MuseumSet) => ({
        value: set.id,
        label: set.name,
      })),
    ]);
  }, [ sets ]);

  // Generate sets to show.
  useEffect(() => {
    const filtered = sets.filter((set: MuseumSet) => {
      // if (filter !== 'all') {
      //   if (set.id !== filter) {
      //     return false;
      //   }
      // }

      // if (filter !== '') {
      //   if (filter === 'completed' && set.wing in completedSets && set.id in completedSets[set.wing] && completedSets?.[set.wing]?.[set.id]) {
      //     return false;
      //   }
      //   if (filter === 'incompleted' && completedSets?.[set.wing]?.[set.id]) {
      //     return false;
      //   }
      // }

      if (search !== '') {
        if (!(set.name.toLowerCase().includes(search.toLowerCase()))) {
          return false;
        }
      }

      return true;
    });

    setFilteredItems(filtered);
  }, [
    sets,
    filter,
    search,
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
            <AccordionTrigger className='ml-1 text-xl font-semibold text-gray-900 dark:text-white accordion-trigger'>
              All Museum Sets
            </AccordionTrigger>

            <AccordionContent asChild>
              <ArtifactsItemListControls
                filter={filter}
                setFilter={setFilter}
                wingOptions={wingOptions}
                wingFilter={wingFilter}
                setWingFilter={setWingFilter}
                setSearch={setSearch} />

              <div className='grid grid-cols-1 gap-4 xl:grid-cols-2'>
                {
                  filteredItems.map((
                    set: MuseumSet,
                    index: number,
                  ) => (
                    <SetListAccordion
                      key={`${set.wing}-${set.id}`}
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