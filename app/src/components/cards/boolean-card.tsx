/* eslint-disable @typescript-eslint/no-explicit-any */
// Packages
import type {
  Dispatch,
  SetStateAction,
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
  overrides,
  type,
  completed,
  setIsOpen,
  setObject,
  handleStatusChange,
  show,
  setPromptOpen,
}: BooleanCardProps) => {
  const { isMultiSelectMode, selectedItems, toggleItem } = useMultiSelect();
  
  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>
        <button
          className={clsx(
						"relative flex select-none items-center justify-between rounded-lg border px-5 py-4 text-neutral-950 shadow-sm hover:cursor-pointer dark:text-neutral-50",
						completed
							? "border-green-900 bg-green-500/20 hover:bg-green-500/30 dark:bg-green-500/10 hover:dark:bg-green-500/20"
							: "border-neutral-200 bg-white hover:bg-neutral-100 dark:border-neutral-800 dark:bg-neutral-950 dark:hover:bg-neutral-800",
						isMultiSelectMode && isSelected && "ring-primary ring-2",
					)}
					onClick={() => {
						if (isMultiSelectMode) {
							toggleItem(item.itemID.toString());
							return;
						}
						if (minVersion === "1.6.0" && !show && !completed) {
							setPromptOpen?.(true);
							return;
						}
						setObject(item);
						setIsOpen(true);
					}}>
    
        </button>
      </ContextMenuTrigger>

      <ContextMenuContent className='w-48'>
        <ContextMenuCheckboxItem>
          <div className={`h-4 w-4 rounded-full border ${completed ? "border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-950" : "border-green-900 bg-green-500/20 dark:bg-green-500/10"}`} />

          <p>
            {`Set ${completed ? "Inc" : "C"}omplete`}
          </p>
        </ContextMenuCheckboxItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}