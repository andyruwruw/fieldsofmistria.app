/* eslint-disable @typescript-eslint/no-explicit-any */
// Packages
import {
  useContext,
  useMemo,
  useState,
  type ReactElement,
} from 'react';

// Local Imports
import { PlayersContext } from '../../contexts/player';
import museumData from '../../data/museum.json';

// Types
import type {
  MuseumSet,
  MuseumWing,
} from '../../types/museum';
import { MuseumSetList } from './components/set-list';
import { MuseumHeader } from './components/header';
import { PageLayout } from '../../components/layouts/page';
import { ItemSheet } from '../../components/sheets/item-sheet';

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
  ] = useState([] as MuseumSet[]);

  // Initialize museum data
  useMemo(() => {
    setWings(museumData.wings);
    setSets(Object.values(museumData.sets).flat() as unknown as MuseumSet[]);
  }, [])

  const [
    wingItemCounts,
    setWingItemCounts,
  ] = useState({} as Record<string, number[]>);
  const [
    completedSets,
    setCompletedSets,
  ] = useState({} as Record<string, Record<string, boolean>>);
  const [
    completedItems,
    setCompletedItems,
  ] = useState({} as Record<string, boolean>);

  // Track completed items
  useMemo(() => {
    const newCompletedItems = {} as Record<string, boolean>;

    if (data && data.museum_progress) {
      for (let i = 0; i < data.museum_progress.length; i += 1) {
        newCompletedItems[data.museum_progress[i].replace(/_+/g, '-').toLowerCase()] = true;
      }
    }

    setCompletedItems(newCompletedItems);
    
    const newCompletedSets = {} as Record<string, Record<string, boolean>>;

    if (stats && stats.set_completions) {
      for (let i = 0; i < stats.set_completions.length; i += 1) {
        const wing = stats.set_completions[i].wing;
        const set = stats.set_completions[i].set.replace(/_+/g, '-').toLowerCase();

        if (!(wing in newCompletedSets)) {
          newCompletedSets[wing] = {};
        }

        newCompletedSets[wing][set] = true;
      }
    }

    setCompletedSets(newCompletedSets);
  }, [
    data,
    stats,
  ]);

  // Figure out progression.
  useMemo(() => {
    const setItemCounts = {} as Record<string, number[]>;

    for (const set of sets) {
      const wing = set.wing.replace('-wing', '');

      if (!(wing in setItemCounts)) {
        setItemCounts[wing] = [
          0, // Items done.
          0, // Total items
        ];
      }

      setItemCounts[wing][1] += set.items.length;

      for (let i = 0; i < set.items.length; i++) {
        const item = set.items[i];

        if (item in completedItems) {
          setItemCounts[wing][0] += 1;
        }
      }
    }

    setWingItemCounts(setItemCounts);
  }, [
    sets,
    completedItems,
  ]);

  // Dialog state
  const [
    open,
    setIsOpen,
  ] = useState(false);
  const [
    object,
    setObject
  ] = useState<any | null>(null);

  return (
    <PageLayout>
      <MuseumHeader
        wings={wings}
        wingItemCounts={wingItemCounts} />

      <MuseumSetList
        sets={sets}
        wings={wings}
        completedSets={completedSets}
        completedItems={completedItems}
        setIsOpen={setIsOpen}
        setObject={setObject} />

      <ItemSheet
        open={open}
        setIsOpen={setIsOpen}
        item={object} />
    </PageLayout>
  );
}
