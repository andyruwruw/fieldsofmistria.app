// Packages
import clsx from 'clsx';

// Local Imports
import {
  ContextMenu,
  ContextMenuTrigger,
} from '../ui/context-menu';
import { EssenceIcon } from '../logos/essence-icon';

// Types
import type { Skill } from '../../types/skills';

/**
 * Props for the SkillCard component.
 */
interface SkillCardProps {
	/**
	 * The skill to display.
	 */
	skill: Skill;

	/**
	 * Indicates whether the player owns the skill.
	 */
	owned: boolean;

	/**
	 * Optional function to set the open state of the skill sheet.
	 */
	setIsOpen?: (open: boolean) => void;

	/**
	 * Optional function to set the skill.
	 */
	setSkill?: (skill: Skill) => void;
}

/**
 * SkillCard component that displays a skill's information.
 *
 * @param props The props for the component.
 * @returns The rendered component.
 */
export const SkillCard = ({
	skill,
	setIsOpen,
	setSkill,
	owned,
}: SkillCardProps) => {
  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>
				<button
					className={clsx(
						'skill-card flex select-none items-center space-x-3 overflow-x-clip rounded-lg border px-5 py-4 text-left text-neutral-950 shadow-sm transition-colors hover:cursor-pointer dark:text-neutral-50 card-button border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-950 hover:bg-neutral-100 dark:hover:bg-neutral-800',
						{
							'border-green-900 bg-green-500 hover:bg-green-500 dark:bg-green-500 hover:dark:bg-green-500 museum-set-on': owned,
						},
					)}
					onClick={() => {
						setSkill?.(skill);
						setIsOpen?.(true);
					}}>
					<img
            className='h-12 w-10 pt-1 pb-1 object-cover object-top'
            src={skill['icon-image']}
            alt={skill.name} />

					<div className='flex-1 ml-2'>
						<p className='truncate font-medium mb-1'>
              { skill.name }
            </p>

						<p className='text-sm text-neutral-500 dark:text-neutral-400'>
              { skill['description'] }
            </p>
					</div>
          
					<div className='flex'>
						<div className='flex items-center justify-between'>
							<p className='pt-[2px] text-sm text-neutral-500 dark:text-neutral-400'>
								{ skill.cost }
							</p>

							<EssenceIcon />
						</div>
					</div>
				</button>
			</ContextMenuTrigger>
    </ContextMenu>
  );
}
