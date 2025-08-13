// Local Imports
import {
  ContextMenu,
  ContextMenuTrigger,
} from '../ui/context-menu';
import { PercentageIndicator } from '../ui/percentage-indicator';
import { SKILL_WING_IMAGES } from '../../config';

/**
 * Props for the SkillBranchCard component.
 */
interface SkillBranchCardProps {
	/**
	 * The skill to display.
	 */
	branch: Record<string, string | number | number[]>;

  level?: number;

  maxLevel?: number;

  perksUnlocked?: number;

  perks?: number;

  onClick?: (id: string) => void;
}

/**
 * SkillBranchCard component that displays a skill branch's information.
 *
 * @param props The props for the component.
 * @returns The rendered component.
 */
export const SkillBranchCard = ({
  branch,
  level = 0,
  maxLevel = 60,
  perksUnlocked = 0,
  perks = 1,
  onClick = () => {}
}: SkillBranchCardProps) => {
  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>
				<button
          className='skill-branch-card flex select-none items-center space-x-3 overflow-x-clip rounded-lg border px-5 py-4 text-left text-neutral-950 shadow-sm transition-colors hover:cursor-pointer dark:text-neutral-50 card-button border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-950 hover:bg-neutral-100 dark:hover:bg-neutral-800'
          onClick={() => {
            if (branch.id) {
              onClick(branch.id as string);
            }
          }}>
					<div
            className='flex ml-2 flex-col items-center justify-center'
            style={{  minWidth: '88px' }}>
            <img
              className='w-8 pt-1 pb-1 object-cover object-top'
              src={SKILL_WING_IMAGES[branch.id as string] || ''}
              alt={branch.name as string} />

						<p className='truncate font-medium mt-1'>
              { branch.name }
            </p>
					</div>

					<div className='flex flex-1 gap-4 justify-end'>
            <div className='flex flex-col items-center justify-between'>
              <p className='text-sm pb-2 text-neutral-500 dark:text-neutral-400'>
                Level
              </p>

              <PercentageIndicator
                className='h-24 w-24'
                percentage={Math.floor(level / maxLevel * 100)}
                color='cyan'
                overrideText={`${level}`} />

              
						</div>

						<div className='flex flex-col items-center justify-between'>
              <p className='text-sm pb-2 text-neutral-500 dark:text-neutral-400'>
                Perks
              </p>

              <PercentageIndicator
                className='h-24 w-24'
                percentage={Math.floor(perksUnlocked / perks * 100)}
                color='violet'
                overrideText={`${perksUnlocked}/${perks}`} />
						</div>
					</div>
				</button>
			</ContextMenuTrigger>
    </ContextMenu>
  );
}
