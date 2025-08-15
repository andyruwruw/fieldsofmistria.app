/* eslint-disable @typescript-eslint/no-unused-vars */
// Packages
import type {
  Dispatch,
  ReactElement,
  SetStateAction,
} from 'react';
import { IconFilterFilled } from '@tabler/icons-react';

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
 * Props for the ArtifactsListControls component.
 */
export interface ArtifactsListControlsProps {
  /**
   * Current filter value.
   */
  filter?: string;

  /**
   * Sets filter value.
   */
  setFilter?: (filter: string) => void;

  /**
   * Set options for filtering.
   */
  setOptions?: Record<'value' | 'label', string>[];

  /**
   * Current set filter value.
   */
  filterSet?: string;

  /**
   * Sets set filter value.
   */
  setFilterSet?: Dispatch<SetStateAction<string>>;

  /**
   * Sets search input value.
   */
  setSearch?: Dispatch<SetStateAction<string>>;
}

/**
 * Colors for filter options.
 */
const BUBBLE_COLORS: Record<string, string> = {
	'0': 'border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-950', // unfound
	'1': 'border-green-900 bg-green-500/20', // found
};

/**
 * Museum set list controls component.
 */
export const ArtifactsListControls = ({
  filter = 'all',
  setFilter = (filter: string) => {},
  setOptions = [] as Record<'value' | 'label', string>[],
  filterSet = 'all',
  setFilterSet = (value: SetStateAction<string>) => {},
  setSearch = (value: SetStateAction<string>) => {},
}: ArtifactsListControlsProps): ReactElement => {
  return (
    <div className='flex flex-col gap-2'>
      <div className='flex w-full flex-col gap-2 md:flex-row md:items-center md:justify-between'>
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
              value='incompleted'
              aria-label='Show Incompleted'
              className='toggle-group-item'>
              <span
                className={combineNames(
                  'inline-block h-4 w-4 rounded-full border align-middle',
                  BUBBLE_COLORS['0'],
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
                  BUBBLE_COLORS['1'],
                )} />
              
              <span className='align-middle'>
                Completed
              </span>
            </ToggleGroupItem>
          </ToggleGroup>
        </div>

        <div className='flex flex-row items-center gap-2'>
          <FilterSearch
            _filter={filterSet}
            title={'Set'}
            data={setOptions}
            setFilter={setFilterSet}
            icon={IconFilterFilled} />
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
    </div>
  );
}
