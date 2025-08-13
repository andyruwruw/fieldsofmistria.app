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
import { combineNames, getHeartCount } from '../../lib/utils';

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

		setHearts(getHeartCount(relationship?.heart_points || 0));
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

	// adeline_post_8h_romantic_progression
	// adeline_post_8h_romantic_grouping
	// cutscene_seen_adeline_four_hearts
	// adeline_post_8h_best_friend_gate
	// adeline_post_8h_romantic_gate
	// adeline_heart_event
	// cutscene_seen_adeline_eight_hearts
	// adeline_eight_heart_priority_bump
	// adeline_post_8h_best_friend_grouping
	// cutscene_seen_adeline_six_hearts

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
            className='h-14 object-cover object-top'
						style={{ minWidth: '47px' }} />

					<div className='flex-1'>
						<p className='truncate font-medium mb-2'>
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