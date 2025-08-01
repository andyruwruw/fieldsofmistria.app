// Packages
import {
  useEffect,
  useState,
  type ReactElement,
} from 'react';

// Data
import characterData from '../../data/characters.json';
import { CharacterCard } from '../../components/cards/character-card';

// Types
import type { Character } from '../../types/characters';
import { CharacterSheet } from '../../components/sheets/character-sheet';

/**
 * Relationships page component.
 */
export default function Relationships(): ReactElement {
  const characters = characterData as unknown as Record<string, Character>;

  const [
    search,
    setSearch,
  ] = useState('');
  const [
    sort,
    setSort,
  ] = useState('name');
  const [
    open,
    setIsOpen,
  ] = useState(false);
  const [
    character,
    setCharacter,
  ] = useState<Character>(characters['celine']);

  const [
    characterList,
    setCharacterList,
  ] = useState(Object.values(characters) as Character[]);

  useEffect(() => {
    // Fetch characters data if needed
    const characters = Object.values(characterData as unknown as Record<string, Character>) as Character[];

    setCharacterList(characters);
  }, [ search ]);
  
  return (
    <div className='mx-auto mt-4 w-full space-y-4'>
      <h1 className='text-left page-title ml-1 text-2xl font-semibold text-gray-900 dark:text-white'>
        Relationship Tracker
      </h1>

      <section className='space-y-3'>
        <h2 className='text-left page-subtitle ml-1 text-xl font-semibold text-gray-900 dark:text-white'>
          All Villagers
        </h2>

        <div className='grid grid-cols-1 justify-between gap-2 lg:flex'>
          <div className='flex flex-row items-center gap-2'>
          </div>
          <div className="grid grid-cols-1 items-stretch gap-2 sm:flex">
          </div>
        </div>

        <div className='grid grid-cols-1 gap-4 xl:grid-cols-4'>
          {characterList.map((character) => (
            <CharacterCard
              key={character.id}
              character={character}
              setIsOpen={setIsOpen}
              setCharacter={setCharacter} />
          ))}
        </div>
      </section>

      <CharacterSheet
        open={open}
        setIsOpen={setIsOpen}
        character={character} />
    </div>
  );
}
