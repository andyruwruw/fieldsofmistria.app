// Packages
import {
  useContext,
  useEffect,
  useState,
  type ReactElement,
} from 'react';
import { IconAdjustments } from '@tabler/icons-react';

// Data
import { CharacterSheet } from '../../components/sheets/character-sheet';
import { PlayersContext } from '../../contexts/player';
import { CharacterCard } from '../../components/cards/character-card';
import { FilterSearch } from '../../components/ui/filter-btn';
import characterData from '../../data/characters.json';

// Types
import type { FieldsOfMistriaNpcData } from '../../types/fields-of-mistria/characters';
import type { Character } from '../../types/characters';
import { Input } from '../../components/ui/input';

const SORT_FILTERS = [
	{
    value: 'name',
    label: 'Name',
  },
	{
    value: 'hearts',
    label: 'Hearts',
  },
];

const BUBBLE_COLORS: Record<string, string> = {
	'0': 'border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-950', // incomplete
	'2': 'border-green-900 bg-green-500/20', // completed
};

/**
 * Relationships page component.
 */
export default function Relationships(): ReactElement {
  const { npcs } = useContext(PlayersContext);
  const characters = characterData as unknown as Record<string, Character>;

  const [
    relationships,
    setRelationships,
  ] = useState<Record<string, FieldsOfMistriaNpcData>>(npcs);
  const [
    characterList,
    setCharacterList,
  ] = useState(Object.values(characters) as Character[]);

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

  useEffect(() => {
    // Fetch characters data if needed
    const characters = Object.values(characterData as unknown as Record<string, Character>) as Character[];

    // Filter characters based on search input
    const filteredCharacters = characters.filter((char) => {
      if (!search) {
        return true;
      }
      return char.name.toLowerCase().includes(search.toLowerCase());
    });

    if (sort === 'name') {
      filteredCharacters.sort((
        a,
        b,
      ) => (a.name.localeCompare(b.name)));
    } else if (relationships && Object.keys(relationships).length && sort === 'hearts') {
      filteredCharacters.sort((
        a,
        b,
      ) => {
        try {
          const aHearts = relationships[a.id]?.heart_points || 0;
          const bHearts = relationships[b.id]?.heart_points || 0;

          return bHearts - aHearts;
        } catch (error) {
          console.error('Error sorting characters by hearts:', error);
          return 0;
        }
      });
    }

    setCharacterList(filteredCharacters);
  }, [
    relationships,
    search,
    sort,
  ]);

  useEffect(() => {
    const newRelationships = {} as Record<string, FieldsOfMistriaNpcData>;

    for (const key of Object.keys(npcs)) {
      newRelationships[key] = npcs[key];
    }

    setRelationships(newRelationships);
  }, [ npcs ]);
  
  return (
    <div className='mx-auto mt-4 w-full space-y-4'>
      <h1 className='text-left page-title ml-1 text-2xl font-semibold text-gray-900 dark:text-white'>
        Relationship Tracker
      </h1>

      <section className='space-y-3'>
        <div className='grid grid-cols-1 gap-2 lg:flex mb-4'>
          <Input
            placeholder='Search..'
            className='flex-auto'
            onChange={(e) => {
              setSearch(e.target.value);
            }} />

          <FilterSearch
            _filter={sort}
            title='Sort By'
            data={SORT_FILTERS}
            setFilter={setSort}
            icon={IconAdjustments} />
        </div>

        <div className='grid grid-cols-1 gap-4 xl:grid-cols-4'>
          {characterList.map((character) => (
            <CharacterCard
              key={character.id}
              character={character}
              relationship={relationships[character.id] || null}
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
