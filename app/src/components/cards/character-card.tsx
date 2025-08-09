/* eslint-disable @typescript-eslint/no-explicit-any */
// Packages
import { HeartIcon } from '@heroicons/react/24/outline';
import { IconChevronRight } from '@tabler/icons-react';

// Local Imports
import {
  ContextMenu,
  ContextMenuTrigger,
} from '../ui/context-menu';
import {
	useEffect,
	useState,
	type JSXElementConstructor,
	type ReactElement,
} from 'react';
import { combineNames } from '../../lib/utils';

// Types
import type { FieldsOfMistriaNpcData } from '../../types/fields-of-mistria/characters';
import type { Character } from '../../types/characters';

/**
 * Props for the CharacterCard component.
 */
interface CharacterCardProps {
	/**
	 * The character to display.
	 */
	character: Character;

	/**
	 * The number of hearts the character has.
	 */
	relationship: FieldsOfMistriaNpcData;

	/**
	 * Optional function to set the open state of the character sheet.
	 */
	setIsOpen?: (open: boolean) => void;

	/**
	 * Optional function to set the character.
	 */
	setCharacter?: (character: Character) => void;
}

const HEART_VALUES = [
	80,
	180,
	280,
	390,
	530,
	705,
	900,
	1125,
	1400,
	1755,
];

/**
 * CharacterCard component that displays a character's information.
 * @param props The props for the component.
 * @returns The rendered component.
 */
export const CharacterCard = ({
	character,
	relationship,
	setIsOpen,
	setCharacter,
}: CharacterCardProps) => {
	const [
		hearts,
		setHearts,
	] = useState(0);
	// const [
	// 	maxHearts,
	// 	setMaxHearts,
	// ] = useState(8);

	useEffect(() => {
		if (!relationship) {
			return;
		}

		let newHearts = 0;

		for (let i = 0; i < HEART_VALUES.length; i++) {
			if (relationship?.heart_points >= HEART_VALUES[i]) {
				newHearts++;
			} else {
				break;
			}
		}

		setHearts(newHearts);
	}, [ relationship ]);

  const getHearts = (count: number) => {
		const icons: ReactElement<unknown, string | JSXElementConstructor<any>>[] = [];

		for (let i = 1; i < count + 1; i++) {
			icons.push(
				<HeartIcon
					key={i}
					className={combineNames(
						'h-5 w-5 text-neutral-500 dark:text-neutral-700',
						hearts >= i
							? 'fill-red-300 text-red-100 dark:text-red-500'
							: character.dateable && i >= 9
								? 'fill-neutral-500 text-neutral-500 dark:fill-neutral-700 dark:text-neutral-700'
								: '',
					)} />,
			);
		}

		return icons;
	};

  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>
				<button
					className={combineNames(
						'flex select-none items-center space-x-3 overflow-x-clip rounded-lg border px-5 py-4 text-left text-neutral-950 shadow-sm transition-colors hover:cursor-pointer dark:text-neutral-50',
						'card-button border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-950 hover:bg-neutral-100 dark:hover:bg-neutral-800',
					)}
					onClick={() => {
						setCharacter?.(character);
						setIsOpen?.(true);
					}}>
					<img
            src={character['spring-image']}
            alt={character.name}
            className='h-12 w-10 object-cover object-top' />

					<div className='flex-1'>
						<p className='truncate font-medium'>
              {character.name}
            </p>

						<div className='flex'>
							{status === 'Dating' ? getHearts(10) : getHearts(8)}
						</div>
					</div>
          
					<IconChevronRight className='h-5 w-5 text-neutral-500 dark:text-neutral-400' />
				</button>
			</ContextMenuTrigger>
    </ContextMenu>
  );
}