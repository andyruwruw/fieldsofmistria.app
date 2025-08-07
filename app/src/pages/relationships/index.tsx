// Packages
import {
  useContext,
  useEffect,
  useState,
  type ReactElement,
} from 'react';

// Data
import {
  ToggleGroup,
  ToggleGroupItem,
} from '../../components/ui/toggle-group';
import { CharacterSheet } from '../../components/sheets/character-sheet';
import { PlayersContext } from '../../contexts/player';
import { CharacterCard } from '../../components/cards/character-card';
import { combineNames } from '../../lib/utils';
import characterData from '../../data/characters.json';

// Types
import type { FieldsOfMistriaNpcData } from '../../types/fields-of-mistria/characters';
import type { Character } from '../../types/characters';

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
    search,
    setSearch,
  ] = useState('');
	const [
    filter,
    setFilter,
  ] = useState('all');
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
    relationships,
    setRelationships,
  ] = useState<Record<string, FieldsOfMistriaNpcData>>(npcs);

  const [
    characterList,
    setCharacterList,
  ] = useState(Object.values(characters) as Character[]);

  useEffect(() => {
    // Fetch characters data if needed
    const characters = Object.values(characterData as unknown as Record<string, Character>) as Character[];

    setCharacterList(characters);
  }, [ search ]);

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
        <h2 className='text-left page-subtitle ml-1 text-xl font-semibold text-gray-900 dark:text-white'>
          All Villagers
        </h2>

        <div className='grid grid-cols-1 justify-between gap-2 lg:flex'>
          <div className='flex flex-row items-center gap-2'>
            <ToggleGroup
              variant='outline'
              type='single'
              value={filter}
              onValueChange={(val) =>
                setFilter(val === filter ? 'all' : val)
              }
              className='gap-2'>
              <ToggleGroupItem value='0' aria-label='Show Incomplete'>
                <span
                  className={combineNames(
                    'inline-block h-4 w-4 rounded-full border align-middle',
                    BUBBLE_COLORS['0'],
                  )} />
                <span className='align-middle'>Incomplete</span>
              </ToggleGroupItem>
              <ToggleGroupItem value='2' aria-label='Show Completed'>
                <span
                  className={combineNames(
                    'inline-block h-4 w-4 rounded-full border align-middle',
                    BUBBLE_COLORS['2'],
                  )} />

                <span className='align-middle'>
                  Completed
                </span>
              </ToggleGroupItem>
            </ToggleGroup>
          </div>

          <div className='grid grid-cols-1 items-stretch gap-2 sm:flex'>
          </div>
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
