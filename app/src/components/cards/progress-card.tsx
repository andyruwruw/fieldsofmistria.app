/* eslint-disable @typescript-eslint/no-explicit-any */
// Local Imports
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '../ui/card';
import { PercentageIndicator } from '../ui/percentage-indicator';

/**
 * Props for the ProgressCard component.
 */
interface ProgressCardProps {
  /**
   * The title of the progress card.
   */
	title: string;

  /**
   * The description of the progress card.
   */
	description: string;

  /**
   * The percentage of progress to display.
   */
	percentage: number;

  /**
   * The footer text of the progress card.
   */
	footer: string;

  /**
   * Additional CSS classes to apply to the card.
   */
	[rest: string]: any;
}

/**
 * ProgressCard component.
 * @param props The props for the ProgressCard component.
 * @returns A JSX element representing the progress card.
 */
export const ProgressCard = ({
	title,
	description,
	percentage,
	footer,
	...rest
}: ProgressCardProps) => {
	const checkedClass = percentage === 100 ? 'border-green-900 bg-green-500/20 dark:bg-green-500/10 dark:border-green-900' : '';
	
  return (
		<Card
      className={checkedClass}
      {...rest}>
			<div className='grid grid-cols-3'>
				<div className='flex flex-col col-span-2'>
					<CardHeader className='flex flex-row items-cnter justify-between space-y-0 pb-2'>
						<CardTitle className='text-sm font-semibold'>
              {title}
            </CardTitle>
					</CardHeader>

					<CardContent>
						<p className='text-2xl font-bold'>
              {description}
            </p>

						<p className='text-xs font-medium text-neutral-500 dark:text-neutral-500'>
							{footer}
						</p>
					</CardContent>
				</div>

				<div className='flex justify-end items-center p-5'>
					<PercentageIndicator
            percentage={percentage}
            className='h-16 w-16' />
				</div>
			</div>
		</Card>
	);
};
