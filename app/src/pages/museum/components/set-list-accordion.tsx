/* eslint-disable @typescript-eslint/no-explicit-any */
// Packages
import {
	useEffect,
	useState,
	type CSSProperties,
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
import { SetListAccordionItem } from './set-list-accordion-item';
import { Progress } from '../../../components/ui/progress';

// Types
import type { MuseumSet } from '../../../types/museum';

/**
 * Props for the SetListAccordion component.
 */
interface SetListAccordionProps {
	/**
	 * The museum display set to show in the accordion.
	 */
	set: MuseumSet;

	/**
   * Map of completed sets.
   */
  completedSets?: Record<string, Record<string, boolean>>;

  /**
   * Map of completed items.
   */
  completedItems?: Record<string, boolean>;

	/**
	 * Callback to set the open state of the accordion item.
	 */
	setIsOpen?: Dispatch<SetStateAction<boolean>>;
	
	/**
	 * Callback to set the object for the accordion item.
	 */
	setObject?: Dispatch<SetStateAction<any | null>>;

	/**
	 * Additional class names for the accordion item.
	 */
	className?: string;

	/**
	 * Styles for the accordion item.
	 */
	style?: CSSProperties;
};

/**
 * SetListAccordion component.
 * @param props The props for the SetListAccordion component.
 * @returns The rendered SetListAccordion component.
 */
export const SetListAccordion = ({
	set,
	completedSets = {},
	completedItems = {},
	setIsOpen = () => {},
	setObject = () => {},
	className = '',
	style = {} as CSSProperties,
}: SetListAccordionProps): ReactElement => {
	const isDesktop = window.innerWidth >= 768;

	const [
		done,
		setDone,
	] = useState(false);
	const [
		progress,
		setProgress,
	] = useState(0);

	useEffect(() => {
		const completedSetsLocal = completedSets[(set.wing).replace('-wing', '')] || {};

		setDone(set.id in completedSetsLocal || false);
	}, [
		set,
		completedSets
	]);

	useEffect(() => {
		let sum = 0;

		for (const item of set.items) {
			if (item in completedItems) {
				sum += 1;
			}
		}

		setProgress(sum); //  / set.items.length

		if (sum === set.items.length) {
			setDone(true);
		}
	}, [
		set,
		completedItems
	]);

	return (
		<Accordion
			className={className}
			style={style}
			defaultValue='main'
			type='single'
			collapsible
			asChild>
			<section
				className={clsx(
					'relative h-min select-none justify-between space-y-3 rounded-lg border px-5 pt-4 text-neutral-950 shadow-sm hover:cursor-pointer dark:text-neutral-50',
					done
						? 'border-green-900 bg-green-500/20 hover:bg-green-500/30 dark:bg-green-500/10 hover:dark:bg-green-500/20'
						: 'border-neutral-200 dark:border-neutral-800',
				)}>
				<AccordionItem
					value='main'
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
									max={set.items.length}
									className='w-32'
								/>
							</div>
						)}
					</AccordionTriggerNoToggle>

					<AccordionContent asChild>
						<div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
							{
								set.items.map((id: string) => (
									<SetListAccordionItem
										key={id}
										id={id}
										overrideComplete={done}
										completedItems={completedItems}
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