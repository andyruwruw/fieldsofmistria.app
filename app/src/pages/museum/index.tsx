/* eslint-disable @typescript-eslint/no-explicit-any */
// Packages
import {
  useContext,
  useEffect,
  useState,
  type CSSProperties,
  type ReactElement,
} from 'react';
import { IconFilterFilled } from '@tabler/icons-react';

// Local Imports
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '../../components/ui/accordion';
import {
  ToggleGroup,
  ToggleGroupItem,
} from '../../components/ui/toggle-group';
import {
  Command,
  CommandInput,
} from '../../components/ui/command';
import { PlayersContext } from '../../contexts/player';
import { combineNames } from '../../lib/utils';
import { FilterSearch } from '../../components/ui/filter-btn';
import artifactsData from '../../data/artifacts.json';
import museumData from '../../data/museum.json';
import cropsData from '../../data/crops.json';
import bugsData from '../../data/bugs.json';
import fishData from '../../data/fish.json';

// Types
import type {
  Artifact,
  MuseumDisplaySet,
  MuseumDisplaySetItem,
  MuseumWing,
} from '../../types/museum';
import type { Fish } from '../../types/fish';
import type { Crop } from '../../types/crops';
import type { Bug } from '../../types/bugs';
import { ItemSheet } from '../../components/sheets/item-sheet';
import MuseumHeader from './components/header';
import PageLayout from '../../components/layouts/page';
import { SetListAccordion } from './components/set-list-accordion';

/**
 * Resolves an item by its ID.
 *
 * @param id The ID of the item to resolve.
 * @returns The resolved item, or null if not found.
 */
const resolveItem = (id: string): any => {
  if (id in artifactsData) {
    return (artifactsData as unknown as Record<string, Artifact>)[id];
  } else if (id in bugsData) {
    return (bugsData as unknown as Record<string, Bug>)[id];
  } else if (id in cropsData) {
    return (cropsData as unknown as Record<string, Crop>)[id];
  } else if (id in fishData) {
    return (fishData as unknown as Record<string, Fish>)[id];
  }

  return null;
}

const bubbleColors: Record<string, string> = {
	'0': 'border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-950', // unfound
	'1': 'border-green-900 bg-green-500/20', // found
};

/**
 * Museum page component.
 */
export default function Museum(): ReactElement {
  const {
    data,
    stats,
  } = useContext(PlayersContext);

  const [
    progress,
    setProgress,
  ] = useState(0);
  const [
    wingProgress,
    setWingProgress,
  ] = useState({} as Record<string, number>);
  const [
    wings,
    setWings,
  ] = useState([] as MuseumWing[]);
  const [
    sets,
    setSets,
  ] = useState([] as MuseumDisplaySet[]);

  const [
    type,
    setType,
  ] = useState([] as Record<string, string>[]);
  const [
    search,
    setSearch,
  ] = useState('');
  const [
    _filter,
    setFilter,
  ] = useState('all');
  const [
    _wingFilter,
    setWingFilter,
  ] = useState('all');
  const [
    filteredSets,
    setFilteredSets,
  ] = useState([] as MuseumDisplaySet[]);

  useEffect(() => {
    setWings(museumData.wings);

    setType([
      {
        value: 'all',
        label: 'All Sets',
      },
      ...wings.map((wing: MuseumWing) => ({
        value: wing.id,
        label: wing.name,
      }))
    ]);

    const completedItems = {} as Record<string, boolean>;

    if (data && data.museum_progress) {
      for (let i = 0; i < data.museum_progress.length; i += 1) {
        completedItems[data.museum_progress[i].replace(/_+/g, '-').toLowerCase()] = true;
      }
    }

    const setCompletions = {} as Record<string, Record<string, boolean>>;

    if (stats && stats.set_completions) {
      for (let i = 0; i < stats.set_completions.length; i += 1) {
        const wing = stats.set_completions[i].wing;
        const set = stats.set_completions[i].set.replace(/_+/g, '-').toLowerCase();

        if (!(stats.set_completions[i].wing in setCompletions)) {
          setCompletions[stats.set_completions[i].wing] = {};
        }

        setCompletions[wing][set] = true;
      }
    }

    const newSets = [] as MuseumDisplaySet[];
    let totalItems = 0;
    let itemsCompletedSum = 0;

    const newWingProgress = {} as Record<string, number>;

    for (const wing of wings) {
      const wingSets = museumData.sets[wing.id as keyof typeof museumData.sets];
      let wingTotalItems = 0;
      let wingItemsCompletedSum = 0;

      for (let i = 0; i < wingSets.length; i += 1) {
        const wingId = wing.id.replace('-wing', '');
        const set = wingSets[i];

        const displaySet = {
          id: set.id,
          name: set.name,
          items: [] as MuseumDisplaySetItem[],
          done: wingId in setCompletions && set.id in setCompletions[wingId] ?setCompletions[wingId][set.id] : false,
          wing: wing.id,
        } as MuseumDisplaySet;

        const items = set.items;
        let allComplete = true;

        for (let i = 0; i < items.length; i += 1) {
          const item = resolveItem(items[i]);
          totalItems += 1;
          wingTotalItems += 1;

          if (item) {
            let forceDone = false;
            if (item.id === 'copper-nugget-beetle' && 'copper-beetle' in completedItems && completedItems['copper-beetle']) {
              forceDone = true;
            }

            const done = forceDone || (item.id in completedItems ? (completedItems as Record<string, boolean>)[item.id] : false);

            if (!done) {
              allComplete = false;
            } else {
              itemsCompletedSum += 1;
              wingItemsCompletedSum += 1;
            }

            displaySet.items.push({
              id: item.id,
              name: item.name,
              image: item.image,
              description: item.description,
              done,
            });

            if (!forceDone && (wingId in setCompletions && set.id in setCompletions[wingId] ?setCompletions[wingId][set.id] : false) && (!(item.id in completedItems) || !completedItems[item.id])) {
              console.log(`Weird ID things when verifying, ${item.id}`);
            }
          }
        }

        if (allComplete && !displaySet.done) {
          displaySet.done = true;
        }

        newSets.push(displaySet);
      }

      newWingProgress[wing.id] = wingItemsCompletedSum > 0 ? wingItemsCompletedSum / wingTotalItems : 0;
    }

    setWingProgress(newWingProgress);
    setProgress(totalItems > 0 ? itemsCompletedSum / totalItems : 0);

    setSets(newSets);
  }, [
    data,
    stats,
    wings,

  ]);

  useEffect(() => {
    const filtered = sets.filter((set: MuseumDisplaySet) => {
      if (_wingFilter !== 'all') {
        if (set.wing !== _wingFilter) {
          return false;
        }
      }

      if (_filter !== '') {
        if (_filter === 'completed' && !set.done) {
          return false;
        }
        if (_filter === 'incompleted' && set.done) {
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
    _wingFilter,
    _filter,
    search,
    sets,
  ]);

  const [
    open,
    setIsOpen,
  ] = useState(false);
  const [
    object,
    setObject
  ] = useState<any | null>(null);

  return (
    <>
      <PageLayout>
        <MuseumHeader
          progress={progress}
          wings={wings}
          wingProgress={wingProgress} />

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
                  <div className='flex w-full flex-col gap-2 md:flex-row md:items-center md:justify-between'>
                    <div className='flex flex-row items-center gap-2'>
                      <ToggleGroup
                        variant='outline'
                        type='single'
                        className='gap-2'
                        value={_filter}
                        onValueChange={(val) =>
                          setFilter(val === _filter ? 'all' : val)
                        }>
                        <ToggleGroupItem
                          value='incompleted'
                          aria-label='Show Incompleted'
                          className='toggle-group-item'>
                          <span
                            className={combineNames(
                              'inline-block h-4 w-4 rounded-full border align-middle',
                              bubbleColors['0'],
                            )} />

                          <span className='align-middle'>
                            Incomplete
                          </span>
                        </ToggleGroupItem>

                        <ToggleGroupItem
                          value='completed'
                          aria-label='Show Completed'
                          className='toggle-group-item'>
                          <span
                            className={combineNames(
                              'inline-block h-4 w-4 rounded-full border align-middle',
                              bubbleColors['2'],
                            )} />
                          
                          <span className='align-middle'>
                            Completed
                          </span>
                        </ToggleGroupItem>
                      </ToggleGroup>
                    </div>

                    <div className='flex flex-row items-center gap-2'>
                      <FilterSearch
                        _filter={_wingFilter}
                        title={'Wing'}
                        data={type}
                        setFilter={setWingFilter}
                        icon={IconFilterFilled} />
                    </div>
                  </div>

                  <div className='mt-2 w-full pb-5'>
                    <Command className='w-full border border-b-0 dark:border-neutral-800'>
                      <CommandInput
                        onValueChange={(v) => {
                          setSearch(v);
                        }}
                        placeholder='Search Sets' />
                    </Command>
                  </div>
                  
                  <div className='grid grid-cols-1 gap-4 xl:grid-cols-2'>
                    {
                      filteredSets.map((
                        set: MuseumDisplaySet,
                        index: number,
                      ) => (
                        <SetListAccordion
                          className='slide-in'
                          style={{
                            '--index': index / 3,
                          } as CSSProperties}
                          key={`${set.wing}-${set.id}`}
                          set={set}
                          setIsOpen={setIsOpen}
                          setObject={setObject} />
                      ))
                    }
                  </div>
                </AccordionContent>
            </AccordionItem>
          </section>
        </Accordion>

        <ItemSheet
          open={open}
          setIsOpen={setIsOpen}
          item={object} />
      </PageLayout>
    </>
  );
}
