/* eslint-disable @typescript-eslint/no-unused-vars */
// Packages
import type {
  Dispatch,
  ReactElement,
  SetStateAction,
} from 'react';
import { IconAdjustments } from '@tabler/icons-react';

// Local Imports
import {
  ToggleGroup,
  ToggleGroupItem,
} from '../../../components/ui/toggle-group';
import {
  Command,
  CommandInput,
} from '../../../components/ui/command';
import { combineNames } from '../../../lib/utils';
import { FilterSearch } from '../../../components/ui/filter-btn';

/**
 * Props for the RelationshipsCharacterListControls component.
 */
export interface RelationshipsCharacterListControlsProps {
  /**
   * Current filter value.
   */
  filter?: string;

  /**
   * Sets filter value.
   */
  setFilter?: (filter: string) => void;

  /**
   * Current sort value.
   */
  sort?: string;

  /**
   * Sets sort input value.
   */
  setSort?: Dispatch<SetStateAction<string>>;

  /**
   * Sets search input value.
   */
  setSearch?: Dispatch<SetStateAction<string>>;
}

/**
 * Sort filters for the character list.
 */
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

/**
 * Colors for filter options.
 */
const BUBBLE_COLORS: Record<string, string> = {
	'0': 'border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-950', // unfound
	'1': 'border-pink-900 bg-pink-500/20', // found
	'2': 'border-blue-900 bg-blue-500/20', // found
};

/**
 * Character list controls component.
 */
export const RelationshipsCharacterListControls = ({
  filter = 'all',
  setFilter = (filter: string) => {},
  sort = 'name',
  setSort = (value: SetStateAction<string>) => {},
  setSearch = (value: SetStateAction<string>) => {},
}: RelationshipsCharacterListControlsProps): ReactElement => {
  return (
    <>
      <div className='flex justify-between'>
        <div className='flex flex-row items-center gap-2'>
          <ToggleGroup
            variant='outline'
            type='single'
            className='gap-2'
            value={filter}
            onValueChange={(val) =>
              setFilter(val === filter ? 'all' : val)
            }>
            <ToggleGroupItem
              value='all'
              aria-label='Show All'
              className='toggle-group-item'>
              <span
                className={combineNames(
                  'inline-block h-4 w-4 rounded-full border align-middle',
                  BUBBLE_COLORS['0'],
                )} />

              <span className='align-middle'>
                All
              </span>
            </ToggleGroupItem>

            <ToggleGroupItem
              value='dateable'
              aria-label='Show Dateable'
              className='toggle-group-item'>
              <span
                className={combineNames(
                  'inline-block h-4 w-4 rounded-full border align-middle',
                  BUBBLE_COLORS['1'],
                )} />
              
              <span className='align-middle'>
                Dateable
              </span>
            </ToggleGroupItem>

            <ToggleGroupItem
              value='undateable'
              aria-label='Show Undateable'
              className='toggle-group-item'>
              <span
                className={combineNames(
                  'inline-block h-4 w-4 rounded-full border align-middle',
                  BUBBLE_COLORS['2'],
                )} />
              
              <span className='align-middle'>
                Undateable
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
            placeholder='Search Characters' />
        </Command>
      </div>
    </>
  );
}
