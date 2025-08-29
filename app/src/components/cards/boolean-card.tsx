/* eslint-disable @typescript-eslint/no-explicit-any */
// Packages
import {
  useEffect,
  useState,
  type Dispatch,
  type SetStateAction,
} from 'react';
import clsx from 'clsx';

// Local Imports
import {
  ContextMenu,
  ContextMenuCheckboxItem,
  ContextMenuContent,
  ContextMenuTrigger,
} from '../ui/context-menu';
import { useMultiSelect } from '../../contexts/multi-select/use-multi-select';
import { IconChevronRight } from '@tabler/icons-react';
import ItemWithOverlay from '../ui/item-with-overlay';

/**
 * Props for the BooleanCard component.
 */
interface BooleanCardProps {
  /**
   * The item to display.
   */
  item: Record<string, any>;

  /**
   * Optional overrides for the item.
   */
  overrides?: {
    name?: string;
    description?: string;
    image?: string;
  }

  /**
   * The type of the item.
   */
  type: string;

  /**
   * Whether the item is completed.
   */
  completed: boolean;

  /**
   * Set function to open the item.
   */
  setIsOpen: Dispatch<SetStateAction<boolean>>;

  /**
   * Set function to set the item.
   */
  setObject: any;

  /**
   * Handle changes to the item's status.
   */
  handleStatusChange?: (status: number) => void;

  /**
   * Whether the card should show.
   */
  show: boolean;

  /**
   * Set function to open the prompt.
   */
  setPromptOpen?: Dispatch<SetStateAction<boolean>>;
}

/**
 * BooleanCard component that displays a character's information.
 * @param props The props for the component.
 * @returns The rendered component.
 */
export const BooleanCard = ({
  item,
  completed,
  setIsOpen,
  setObject,
}: BooleanCardProps) => {
  const {
    isMultiSelectMode,
    selectedItems,
    toggleItem,
  } = useMultiSelect();

  const [
    localCompleted,
    setLocalCompleted,
  ] = useState(completed);
  const [
    buttonClasses,
    setButtonClasses,
  ] = useState('');

  const isSelected = selectedItems.has(item.id.toString());

  const name = item.name;
	const description = item.description as string | null;
  const icon = item.image as string;

  useEffect(() => {
    setLocalCompleted(completed);

    setButtonClasses(clsx(
      'relative flex select-none items-center justify-between rounded-lg border px-5 py-4 text-neutral-950 shadow-sm hover:cursor-pointer dark:text-neutral-50',
      completed
        ? 'border-green-900 bg-green-500 hover:bg-green-500 dark:bg-green-500 hover:dark:bg-green-500 museum-set-on'
        : 'border-neutral-200 bg-white hover:bg-neutral-100 dark:border-neutral-800 dark:bg-neutral-950 dark:hover:bg-neutral-800',
      isMultiSelectMode && isSelected && 'ring-primary ring-2',
    ));
  }, [
    item,
    completed,
    localCompleted,
    isMultiSelectMode,
    isSelected
  ]);

  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>
        <button
          className={buttonClasses}
          onClick={() => {
            if (isMultiSelectMode) {
              toggleItem(item.itemID.toString());
              return;
            }
            setObject(item);
            setIsOpen(true);
            
          }}>
          <div className='flex items-center space-x-3 truncate text-left'>
						<ItemWithOverlay
							src={icon}
							alt={name}
							className='rounded-sm'
							width={32}
							height={32} />

						<div className='min-w-0 flex-1'>
							<p className='truncate font-medium'>
                {name}
              </p>

							<p className='truncate text-sm text-neutral-500 dark:text-neutral-400'>
								{description}
							</p>
						</div>
					</div>

					<IconChevronRight className='h-5 w-5 flex-shrink-0 text-neutral-500 dark:text-neutral-400' />
        </button>
      </ContextMenuTrigger>

      <ContextMenuContent className='w-48'>
        <ContextMenuCheckboxItem>
          <div className={`h-4 w-4 rounded-full border ${localCompleted ? 'border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-950' : 'border-green-900 bg-green-500/20 dark:bg-green-500/10'}`} />

          <p>
            {`Set ${localCompleted ? 'Inc' : 'C'}omplete`}
          </p>
        </ContextMenuCheckboxItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}