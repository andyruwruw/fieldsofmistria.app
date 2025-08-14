/* eslint-disable @typescript-eslint/no-unused-vars */
// Packages
import {
  useEffect,
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
import { RelationshipsCharacterListControls } from './character-list-controls';
import { CharacterCard } from '../../../components/cards/character-card';

// Types
import type { FieldsOfMistriaNpcData } from '../../../types/fields-of-mistria/characters';
import type { Character } from '../../../types/characters';

/**
 * Props for the RelationshipsCharacterList component.
 */
export interface RelationshipsCharacterListProps {
  /**
   * List of relationships characters.
   */
  characters?: Character[];

  /**
   * List of relationships.
   */
  relationships?: Record<string, FieldsOfMistriaNpcData>;

  /**
   * Set the dialog open state.
   */
  setIsOpen?: Dispatch<SetStateAction<boolean>>;

  /**
   * Set the selected character.
   */
  setCharacter?: Dispatch<SetStateAction<Character>>;
};

/**
 * Museum set list component.
 */
export const RelationshipsCharacterList = ({
  characters = [],
  relationships = {},
  setIsOpen = () => {},
  setCharacter = () => {},
}: RelationshipsCharacterListProps): ReactElement => {
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
    sort,
    setSort,
  ] = useState('name');

  // Characters to show.
  const [
    filteredCharacters,
    setFilteredCharacters,
  ] = useState([] as Character[]);

  // Generate characters to show.
  useEffect(() => {
    const filtered = characters.filter((character: Character) => {
      if (search !== '') {
        if (!(character.name.toLowerCase().includes(search.toLowerCase()))) {
          return false;
        }
      }

      if (filter !== 'all') {
        if (filter === 'dateable' && !character.dateable) {
          return false;
        }
        if (filter === 'undateable' && character.dateable) {
          return false;
        }
      }

      return true;
    });

    if (sort === 'name') {
      filtered.sort((
        a,
        b,
      ) => (a.name.localeCompare(b.name)));
    } else if (relationships && Object.keys(relationships).length && sort === 'hearts') {
      filtered.sort((
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

    setFilteredCharacters(filtered);
  }, [
    characters,
    search,
    sort,
    relationships,
    filter,
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
              All Characters
            </AccordionTrigger>

            <AccordionContent asChild>
              <RelationshipsCharacterListControls
                filter={filter}
                setFilter={setFilter}
                sort={sort}
                setSort={setSort}
                setSearch={setSearch} />

              <div className='grid grid-cols-1 gap-4 xl:grid-cols-2'>
                {filteredCharacters.map((character: Character) => (
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
    </>
  );
}