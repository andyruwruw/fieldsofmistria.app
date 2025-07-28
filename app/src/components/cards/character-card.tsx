/* eslint-disable @typescript-eslint/no-explicit-any */
// Packages
import { HeartIcon } from '@heroicons/react/24/outline';
import { IconChevronRight } from '@tabler/icons-react';

// Local Imports
import {
  ContextMenu,
  ContextMenuTrigger,
} from '../ui/context-menu';
import { combineNames } from '../../lib/utils';
import type { JSXElementConstructor, ReactElement } from 'react';

/**
 * Props for the CharacterCard component.
 */
interface CharacterCardProps {
	character: Character;
}

const classes = [
	'border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-950 hover:bg-neutral-100 dark:hover:bg-neutral-800',
	'border-green-900 bg-green-500/20 hover:bg-green-500/30 dark:bg-green-500/10 hover:dark:bg-green-500/20',
];

/**
 * CharacterCard component that displays a character's information.
 * @param param0 - The props for the component.
 * @returns The rendered component.
 */
export const CharacterCard = ({ character }: CharacterCardProps) => {
  const hearts = Math.floor(0 / 250);

  const getHearts = (count: number) => {
		const icons: ReactElement<unknown, string | JSXElementConstructor<any>>[] = [];

		for (let i = 1; i < count + 1; i++) {
			icons.push(
				<HeartIcon
					key={i}
					className={combineNames(
						"h-5 w-5 text-neutral-500 dark:text-neutral-700",
						hearts >= i
							? "fill-red-500 text-red-500 dark:text-red-500"
							: character.dateable && i >= 9
								? "fill-neutral-500 text-neutral-500 dark:fill-neutral-700 dark:text-neutral-700"
								: "",
					)} />,
			);
		}

		return icons;
	};

  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>
				<button className='flex select-none items-center space-x-3 overflow-x-clip rounded-lg border px-5 py-4 text-left text-neutral-950 shadow-sm transition-colors hover:cursor-pointer dark:text-neutral-50'>
					<img
            src={character.image}
            alt={character.name}
            className='h-12 w-12 object-cover object-top' />

					<div className='flex-1'>
						<p className='truncate font-medium'>
              {character.name}
            </p>

						<div className='flex'>
							{status === 'Married' ? getHearts(14) : getHearts(10)}
						</div>
					</div>
          
					<IconChevronRight className='h-5 w-5 text-neutral-500 dark:text-neutral-400' />
				</button>
			</ContextMenuTrigger>
    </ContextMenu>
  );
}