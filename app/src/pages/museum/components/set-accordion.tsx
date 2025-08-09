// Packages
import { type ReactElement } from 'react';
import { IconSettings } from '@tabler/icons-react';
import clsx from 'clsx';

// Local Imports
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTriggerNoToggle,
} from '../../../components/ui/accordion';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuLabel,
	DropdownMenuRadioGroup,
	DropdownMenuRadioItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '../../../components/ui/dropdown-menu';
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from '../../../components/ui/tooltip';

// Types
import type { MuseumSet } from '../../../types/museum';
import { Progress } from '../../../components/ui/progress';

interface SetAccordionProps {
	set: MuseumSet;

	items: Record<string, boolean>;

	done: Record<string, Record<string, boolean>>;
};

/**
 * SetAccordion component.
 * @param props The props for the SetAccordion component.
 * @returns The rendered SetAccordion component.
 */
export default function SetAccordion({
	set,
	items = {},
	done = {},
}: SetAccordionProps): ReactElement {
	const setDone = false;
	const isDesktop = window.innerWidth >= 768; // Example breakpoint for desktop

	return (
		<Accordion type='single' collapsible defaultValue='item-1' asChild>
			<section
				className={clsx(
					'relative h-min select-none justify-between space-y-3 rounded-lg border px-5 pt-4 text-neutral-950 shadow-sm hover:cursor-pointer dark:text-neutral-50',
					setDone
						? 'border-green-900 bg-green-500/20 hover:bg-green-500/30 dark:bg-green-500/10 hover:dark:bg-green-500/20'
						: 'border-neutral-200 dark:border-neutral-800',
				)}>
				<AccordionItem value='item-1' className='border-none'>
					<AccordionTriggerNoToggle
						className={`ml-1 pt-0 text-xl font-semibold text-gray-900 dark:text-white hover-no-border ${isDesktop ? 'flex-row' : 'flex-col items-start'}`}
						style={{ margin: '0', padding: '0' }}>
						<div>
							<div className='flex items-center gap-3'>
								<span style={{ fontSize: '20px' }}>
									{set.name}
								</span>
							</div>
						</div>

						{!setDone && (
							<div className={`flex items-center ${isDesktop ? '' : 'pt-2'}`}>
								<Progress
									value={4}
									max={4}
									className='w-32'
								/>
							</div>
						)}
					</AccordionTriggerNoToggle>

					<AccordionContent asChild>
						<div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
						</div>
					</AccordionContent>
				</AccordionItem>
			</section>
		</Accordion>
	);
}