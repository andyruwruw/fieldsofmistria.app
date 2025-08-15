// Packages
import {
  useEffect,
  useMemo,
  useState,
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
import { ArtifactsListControls } from './artifacts-list-controls';

// Types
import type {
  Artifact,
  MuseumDisplaySet,
  MuseumSet,
} from '../../../types/museum';
import { ArtifactListItem } from './artifact-list-item';

/**
 * Props for the ArtifactsList component.
 */
export interface ArtifactsListProps {
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
export const ArtifactsList = ({
  artifacts = [],
  sets = [],
  completedItems = {},
  setIsOpen = () => {},
  setObject = () => {},
}: ArtifactsListProps): ReactElement => {
  const [
    museumItems,
    setMuseumItems,
  ] = useState({} as Record<string, string>);

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
    setOptions,
    setSetOptions,
  ] = useState([{
    value: 'all',
    label: 'All Sets',
  }]);
  const [
    filterSet,
    setFilterSet,
  ] = useState('all');
  const [
    setNames,
    setSetNames,
  ] = useState({} as Record<string, string>);

  // Sets to show.
  const [
    filteredItems,
    setFilteredItems,
  ] = useState([] as Artifact[]);

  // Set wing filter options.
  useMemo(() => {
    const newSetOptions = [{
      value: 'all',
      label: 'All Sets',
    }];
    const newSetNames = {} as Record<string, string>;

    for (const set of sets) {
      newSetOptions.push({
        value: set.id,
        label: set.name,
      });
      newSetNames[set.id] = set.name;

      for (const item of set.items) {
        museumItems[item] = set.id;
      }
    }

    setSetOptions(newSetOptions);
    setMuseumItems(museumItems);
    setSetNames(newSetNames);
  }, [
    sets,
    museumItems,
  ]);

  // Generate sets to show.
  useEffect(() => {
    const filtered = artifacts.filter((artifact: Artifact) => {
      if (filter !== 'all') {
        if (filter === 'completed' && !(artifact.id in completedItems)) {
          return false;
        }

        if (filter === 'incompleted' && artifact.id in completedItems) {
          return false;
        }
      }

      if (filterSet !== 'all') {

        if (!(artifact.id in museumItems) || museumItems[artifact.id] !== filterSet) {
          return false;
        }
      }

      if (search !== '') {
        if (!(artifact.name.toLowerCase().includes(search.toLowerCase()))) {
          return false;
        }
      }

      return true;
    });

    setFilteredItems(filtered);
  }, [
    artifacts,
    filter,
    completedItems,
    search,
    filterSet,
    museumItems,
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
              All Artifacts
            </AccordionTrigger>

            <AccordionContent asChild>
              <ArtifactsListControls
                filter={filter}
                setFilter={setFilter}
                setOptions={setOptions}
                filterSet={filterSet}
                setFilterSet={setFilterSet}
                setSearch={setSearch} />

              <div className='w-full text-left'>
                <div className='flex flex-col gap-2'>
                  {
                    filteredItems.map((
                      artifact: Artifact,
                      index: number,
                    ) => (
                      <ArtifactListItem
                        key={`${artifact.id}-${index}`}
                        artifact={artifact}
                        museumItems={museumItems}
                        setNames={setNames}
                        completed={artifact.id in completedItems}
                        setIsOpen={setIsOpen}
                        setObject={setObject} />
                    ))
                  }
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </section>
      </Accordion>
    </>
  );
}