/* eslint-disable @typescript-eslint/no-explicit-any */
// Packages
import {
  useContext,
  useEffect,
  useState,
  type ReactElement,
} from 'react';

// Local Imports
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '../../components/ui/accordion';
import { PlayersContext } from '../../contexts/player';
import artifactsData from '../../data/artifacts.json';
import SetAccordion from './components/set-accordion';
import museumData from '../../data/museum.json';
import cropsData from '../../data/crops.json';
import bugsData from '../../data/bugs.json';
import fishData from '../../data/fish.json';

// Types
import type {
  Artifact,
  MuseumDisplaySet,
  MuseumDisplaySetItem,
  MuseumSet,
  MuseumWing,
} from '../../types/museum';
import type { Fish } from '../../types/fish';
import type { Crop } from '../../types/crops';
import type { Bug } from '../../types/bugs';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';

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

/**
 * Generate a display set from a museum set.
 *
 * @param set The museum set to transform.
 * @returns The generated display set.
 */
function generateSets(
  wing: string,
  sets: MuseumSet[],
  completions: Record<string, Record<string, boolean>> = {},
  progress: Record<string, boolean> = {},
): MuseumDisplaySet[] {
  const displaySets: MuseumDisplaySet[] = [];

  console.log(sets);

  for (const set of sets) {
    const displaySet = {
      id: set.id,
      name: set.name,
      items: [] as MuseumDisplaySetItem[],
      done: wing in completions && set.id in completions[wing] ?completions[wing][set.id] : false,
    } as MuseumDisplaySet;

    const items = set.items;
    let allComplete = true;

    for (let i = 0; i < items.length; i += 1) {
      const item = resolveItem(items[i]);

      if (item) {
        let forceDone = false;
        if (item.id === 'copper-nugget-beetle' && 'copper-beetle' in progress && progress['copper-beetle']) {
          forceDone = true;
        }

        const done = forceDone || (item.id in progress ? (progress as Record<string, boolean>)[item.id] : false);

        if (!done) {
          allComplete = false;
        }

        displaySet.items.push({
          id: item.id,
          name: item.name,
          image: item.image,
          description: item.description,
          done,
        });

        if (!forceDone && (wing in completions && set.id in completions[wing] ?completions[wing][set.id] : false) && (!(item.id in progress) || !progress[item.id])) {
          console.log(`Weird ID things when verifying, ${item.id}`);
        }
      }
    }

    if (allComplete && !displaySet.done) {
      displaySet.done = true;
    }

    displaySets.push(displaySet);
  }

  return displaySets;
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
    wings,
    setWings,
  ] = useState([] as MuseumWing[]);
  const [
    sets,
    setSets,
  ] = useState({} as Record<string, MuseumDisplaySet[]>);
  const [
    progress,
    setProgress,
  ] = useState({});
  const [
    completions,
    setCompletions,
  ] = useState({} as Record<string, Record<string, boolean>>);

  useEffect(() => {
    const progress = {} as Record<string, boolean>;

    if (data && data.museum_progress) {
      for (let i = 0; i < data.museum_progress.length; i += 1) {
        progress[data.museum_progress[i].replace(/_+/g, '-').toLowerCase()] = true;
      }
    }

    setProgress(progress);

    const done = {} as Record<string, Record<string, boolean>>;

    if (stats && stats.set_completions) {
      for (let i = 0; i < stats.set_completions.length; i += 1) {
        const wing = stats.set_completions[i].wing;
        const set = stats.set_completions[i].set.replace(/_+/g, '-').toLowerCase();

        if (!(stats.set_completions[i].wing in done)) {
          done[stats.set_completions[i].wing] = {};
        }

        done[wing][set] = true;
      }
    }

    setCompletions(done);
  }, [
    data,
    stats,
  ]);

  useEffect(() => {
    setWings(museumData.wings);

    const newSets = {} as Record<string, MuseumDisplaySet[]>;

    for (const wing of wings) {
      newSets[wing.id] = generateSets(
        wing.id.replace('-wing', ''),
        museumData.sets[wing.id as keyof typeof museumData.sets] as MuseumSet[],
        completions,
        progress,
      );
    }

    setSets(newSets);

    console.log(newSets);
  }, [
    progress,
    completions,
    wings,
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
      <div className='mx-auto mt-4 w-full space-y-4'>
        <h1 className='text-left page-title ml-1 text-2xl font-semibold text-gray-900 dark:text-white'>
          Museum Tracker
        </h1>

        <Tabs className='tabs'>
          <TabsList className='tabs-list' aria-label='Select a Museum Wing'>
            {
              wings.map((wing) => (
                <TabsTrigger
                  key={wing.id}
                  className='tabs-trigger'
                  value={`tab-${wing.id}`}>
                  <img
                    src={wing.image}
                    alt={wing.name}
                    width='42px'
                    style={{ marginRight: '8px' }} />

                  {wing.name}
                </TabsTrigger>
              ))
            }
          </TabsList>

          {
            Object.keys(sets).map((wing: string) => (
              <TabsContent
                className='tabs-content'
                value={`tab-${wing}`}>
                <div className='grid grid-cols-1 gap-4 xl:grid-cols-2'>
                  {
                    sets[wing].map((set: MuseumDisplaySet) => (
                      <SetAccordion
                        key={set.id}
                        set={set}
                        setIsOpen={setIsOpen}
                        setObject={setObject} />
                    ))
                  }
                </div>
              </TabsContent>
            ))
          }
        </Tabs>
      </div>
    </>
  );
}
