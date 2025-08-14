/* eslint-disable @typescript-eslint/no-unused-vars */
// Packages
import {
  useContext,
  useEffect,
  useState,
  type ReactElement,
} from 'react';

// Data
import { RelationshipsCharacterList } from './components/character-list';
import { RelationshipsHeader } from './components/header';
import { CharacterSheet } from '../../components/sheets/character-sheet';
import { PlayersContext } from '../../contexts/player';
import { getHeartCount } from '../../lib/utils';
import { PageLayout } from '../../components/layouts/page';
import characterData from '../../data/characters.json';

// Types
import type { FieldsOfMistriaNpcData } from '../../types/fields-of-mistria/characters';
import type { Character } from '../../types/characters';

/**
 * Relationships page component.
 */
export default function Relationships(): ReactElement {
  const { npcs } = useContext(PlayersContext);

  const [
    characters,
    setCharacters,
  ] = useState(Object.values(characterData as unknown as Record<string, Character>) as Character[]);
  const [
    relationships,
    setRelationships,
  ] = useState<Record<string, FieldsOfMistriaNpcData>>(npcs);
  const [
    progress,
    setProgress,
  ] = useState<number>(0);

  // Get initial relationships
  useEffect(() => {
    const newRelationships = {} as Record<string, FieldsOfMistriaNpcData>;
    let sum = 0; 

    if (npcs) {
      for (const key of Object.keys(npcs)) {
        newRelationships[key] = npcs[key];

        sum += getHeartCount(npcs[key]?.heart_points || 0) || 0;
      }

      setProgress(sum / ((Object.keys(npcs).length || 0) * 10));
    }

    setRelationships(newRelationships);
  }, [ npcs ]);

  const [
    open,
    setIsOpen,
  ] = useState(false);
  const [
    character,
    setCharacter,
  ] = useState<Character>(characterData as unknown as Record<string, Character>['celine']);
  
  return (
    <PageLayout>
      <RelationshipsHeader progress={progress} />

      <RelationshipsCharacterList
        characters={characters}
        relationships={relationships}
        setIsOpen={setIsOpen}
        setCharacter={setCharacter} />

      {
        open && character && <CharacterSheet
          open={open}
          setIsOpen={setIsOpen}
          character={character} />
      }
    </PageLayout>
  );
}
