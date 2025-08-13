/* eslint-disable @typescript-eslint/no-unused-vars */
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
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../../components/ui/accordion';
import { Card, CardHeader, CardTitle } from '../../components/ui/card';
import { combineNames, getHeartCount } from '../../lib/utils';
import { PercentageIndicator } from '../../components/ui/percentage-indicator';

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
  const {
    npcs,
    data,
    stats,
    header,
    info,
    player,
  } = useContext(PlayersContext);
  const characters = characterData as unknown as Record<string, Character>;

  const [
    relationships,
    setRelationships,
  ] = useState<Record<string, FieldsOfMistriaNpcData>>(npcs);
  const [
    progress,
    setProgress,
  ] = useState<number>(0);
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
  
  return (
    <div className='mx-auto mt-4 w-full space-y-4'>
      <h1 className='text-left page-title ml-1 text-2xl font-semibold text-gray-900 dark:text-white'>
        Relationship Tracker
      </h1>

      <Accordion
        collapsible
        asChild
        defaultValue='item-1'
        type='single'>
        <section className='space-y-3'>
            <AccordionItem value='item-1'>
              <AccordionTrigger
                className='ml-1 text-xl font-semibold text-gray-900 dark:text-white accordion-trigger'>
                Friendship Progress
              </AccordionTrigger>

              <AccordionContent asChild>
                <div className='grid grid-cols-1 grid-rows-2 gap-4 xl:grid-cols-3 2xl:grid-cols-3'>
                  <Card
                    className={combineNames(
                      'col-span-1 row-span-full flex w-full items-center justify-center',
                      progress === 1 &&
                        'border-green-900 bg-green-500/20 dark:border-green-900 dark:bg-green-500/10',
                    )}>
                    <div className='flex flex-col items-center p-4'>
                      <CardHeader className='mb-2 flex flex-col items-center justify-between space-y-0 p-0'>
                        <CardTitle className='text-2xl font-semibold'>
                          Total Completion
                        </CardTitle>
                      </CardHeader>

                      <PercentageIndicator
                        percentage={Math.floor(progress * 100)}
                        className='h-32 w-32 lg:h-48 lg:w-48' />
                    </div>
                  </Card>
                </div>
            </AccordionContent>
          </AccordionItem>
        </section>
      </Accordion>

      <Accordion
        collapsible
        asChild
        defaultValue='item-1'
        type='single'>
        <section className='space-y-3'>
          <AccordionItem value='item-1'>
            <AccordionTrigger
              className='ml-1 text-xl font-semibold text-gray-900 dark:text-white accordion-trigger'>
              All Characters
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
                    _filter={sort}
                    title={'Sort by'}
                    data={SORT_FILTERS}
                    setFilter={setSort}
                    icon={IconAdjustments} />
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
                {characterList.map((character) => (
                  <CharacterCard
                    key={character.id}
                    character={character}
                    relationship={relationships[character.id] || null}
                    setIsOpen={setIsOpen}
                    setCharacter={setCharacter} />
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        </section>
      </Accordion>

      <CharacterSheet
        open={open}
        setIsOpen={setIsOpen}
        character={character} />
    </div>
  );
}
