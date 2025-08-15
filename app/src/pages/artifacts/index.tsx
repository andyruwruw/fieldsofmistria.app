/* eslint-disable @typescript-eslint/no-explicit-any */
// Packages
import {
  useContext,
  useMemo,
  useState,
  type ReactElement,
} from 'react';

// Local Imports
import { PageLayout } from '../../components/layouts/page';
import artifactsData from '../../data/artifacts.json';
import museumData from '../../data/museum.json';

// Types
import type { Artifact, MuseumSet } from '../../types/museum';
import { ArtifactsHeader } from './components/header';
import { ArtifactsList } from './components/artifacts-list';
import { PlayersContext } from '../../contexts/player';

/**
 * Artifacts page component.
 */
export default function Artifacts(): ReactElement {
  const {
    data,
    stats,
  } = useContext(PlayersContext);
  
  const [
    artifacts,
    setArtifacts
  ] = useState(Object.values(artifactsData) as Artifact[]);
  const [
    sets,
    setSets
  ] = useState(Object.values(museumData.sets).flat() as MuseumSet[]);
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
  }, [ data ]);

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
      <ArtifactsHeader progression={0} />

      <ArtifactsList
        artifacts={artifacts}
        sets={sets}
        completedItems={completedItems}
        setIsOpen={setIsOpen}
        setObject={setObject} />
    </PageLayout>
  );
}
