/* eslint-disable @typescript-eslint/no-explicit-any */
// Packages
import {
	useEffect,
	useState,
	type Dispatch,
	type ReactElement,
	type SetStateAction,
} from 'react';
import clsx from 'clsx';

// Local Imports
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTriggerNoToggle,
} from '../../../components/ui/accordion';
import { SetItemCard } from './set-item-card';
import { Progress } from '../../../components/ui/progress';

// Types
import type {
	MuseumDisplaySet,
	MuseumDisplaySetItem,
} from '../../../types/museum';

interface SetAccordionProps {
	set: MuseumDisplaySet;

	setIsOpen: Dispatch<SetStateAction<boolean>>;
	
	setObject: Dispatch<SetStateAction<any | null>>;
};

/**
 * SetAccordion component.
 * @param props The props for the SetAccordion component.
 * @returns The rendered SetAccordion component.
 */
export default function SetAccordion({
	set,
	setIsOpen,
	setObject,
}: SetAccordionProps): ReactElement {
	const isDesktop = window.innerWidth >= 768; // Example breakpoint for desktop

	const [
		done,
		setDone,
	] = useState(false);
	const [
		progress,
		setProgress,
	] = useState(0);
	const [
		count,
		setCount,
	] = useState(5);

	useEffect(() => {
		setDone(set.done);
		setProgress(set.items.filter((item: MuseumDisplaySetItem) => item.done).length);
		setCount(set.items.length);
	}, [ set ]);

	return (
		<Accordion type='single' collapsible defaultValue='item-1' asChild>
			<section
				className={clsx(
					'relative h-min select-none justify-between space-y-3 rounded-lg border px-5 pt-4 text-neutral-950 shadow-sm hover:cursor-pointer dark:text-neutral-50',
					done
						? 'border-green-900 bg-green-500/20 hover:bg-green-500/30 dark:bg-green-500/10 hover:dark:bg-green-500/20'
						: 'border-neutral-200 dark:border-neutral-800',
				)}>
				<AccordionItem
					value='item-1'
					className='border-none'>
					<AccordionTriggerNoToggle
						className={`ml-1 pt-0 text-xl font-semibold text-gray-900 dark:text-white hover-no-border ${isDesktop ? 'flex-row' : 'flex-col items-start'}`}
						style={{
							margin: '0 0 16px',
							padding: '0',
						}}>
						<div>
							<div className='flex items-center gap-3'>
								<span style={{ fontSize: '20px' }}>
									{set.name}
								</span>
							</div>
						</div>

						{!done && (
							<div className={`flex items-center ${isDesktop ? '' : 'pt-2'}`}>
								<Progress
									value={progress}
									max={count}
									className='w-32'
								/>
							</div>
						)}
					</AccordionTriggerNoToggle>

					<AccordionContent asChild>
						<div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
							{
								set.items.map((item: MuseumDisplaySetItem) => (
									<SetItemCard
										key={item.id}
										item={item}
										setIsOpen={setIsOpen}
										setObject={setObject} />
								))
							}
						</div>
					</AccordionContent>
				</AccordionItem>
			</section>
		</Accordion>
	);
}