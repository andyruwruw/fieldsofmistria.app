/* eslint-disable @typescript-eslint/no-explicit-any */
// Packages
import {
  useEffect,
  useState,
  type Dispatch,
  type SetStateAction,
} from 'react';
import clsx from 'clsx';

// Types
import {
  ContextMenu,
  ContextMenuCheckboxItem,
  ContextMenuContent,
  ContextMenuTrigger,
} from '../../../components/ui/context-menu';
import type { Artifact } from '../../../types/museum';
import ItemWithOverlay from '../../../components/ui/item-with-overlay';

/**
 * Props for the ArtifactListItem component.
 */
interface ArtifactListItemProps {
  /**
   * The museum display set item to display.
   */
  artifact: Artifact;

  /**
   * Map of museum items to their display set names.
   */
  museumItems?: Record<string, string>;

  /**
   * Set IDs to names.
   */
  setNames?: Record<string, string>;

  /**
   * Whether the artifact is completed.
   */
  completed?: boolean;

  /**
   * Set function to open the item.
   */
  setIsOpen?: Dispatch<SetStateAction<boolean>>;

  /**
   * Set function to update the object.
   */
  setObject?: Dispatch<SetStateAction<any | null>>;
}

/**
 * ArtifactListItem component for displaying a museum display set item.
 *
 * @param {ArtifactListItemProps} props The props for the component.
 * @returns The rendered component.
 */
export const ArtifactListItem = ({
  artifact,
  museumItems = {},
  setNames = {},
  completed = false,
  setIsOpen = () => {},
  setObject = () => {},
}: ArtifactListItemProps) => {
  const [
    localCompleted,
    setLocalCompleted,
  ] = useState(completed);

  useEffect(() => {
    setLocalCompleted(completed);
  }, [ completed ]);

  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>
        <button
          className={clsx(
            'relative flex select-none items-center justify-between rounded-lg border px-5 py-3 pl-4 text-neutral-950 shadow-sm hover:cursor-pointer dark:text-neutral-50',
            {
              'border-green-900 bg-green-500 hover:bg-green-500 dark:bg-green-500 hover:dark:bg-green-500 museum-set-on': completed,
            }
          )}
          onClick={() => {
            setObject(artifact);
            setIsOpen(true);
          }}>
          <div className='w-full flex items-center space-x-3 truncate items-between'>
            <div className='w-full flex items-center space-x-3 truncate text-left'>
              <ItemWithOverlay
                src={artifact.image}
                alt={artifact.name}
                className='rounded-sm'
                width={42}
                height={42} />

              <div className='min-w-0 flex-1'>
                <p className='truncate font-medium'>
                  {artifact.name}
                </p>

                <p className='truncate text-sm text-neutral-600 dark:text-neutral-600'>
                  {artifact.description}
                </p>
              </div>
            </div>

            <div>
              <span className='truncate text-sm text-neutral-600 dark:text-neutral-600'>
                { museumItems[artifact.id] in setNames ? setNames[museumItems[artifact.id]] : museumItems[artifact.id] || 'Not Found' }
              </span>
            </div>
          </div>
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
  )
}
