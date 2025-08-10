/* eslint-disable @typescript-eslint/no-explicit-any */
// Local Imports
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent
} from '../ui/card';
import { PercentageIndicator } from '../ui/percentage-indicator';

interface CompletionCardProps {
	title: string;
	description: string;
	percentage: number;
	footer: string;
  image?: string;
	[rest: string]: any;
}

export const CompletionCard = ({
	title,
	description,
	percentage,
	footer,
  image,
	...rest
}: CompletionCardProps) => {
	const checkedClass =
		percentage === 100
			? 'border-green-900 bg-green-500/20 dark:bg-green-500/10 dark:border-green-900'
			: '';
	return (
		<Card 
      className={checkedClass}
      {...rest}>
			<div className='grid grid-cols-3'>
				<div className='flex col-span-2 items-center pl-5'>
          {
            (image?.length) ? <img
              src={image}
              alt={title}
              className='col-span-1 h-full w-full object-cover'
              style={{ maxWidth: '64px', maxHeight: '64px' }} />
            : null
          }

					<div className='flex flex-col'>
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
