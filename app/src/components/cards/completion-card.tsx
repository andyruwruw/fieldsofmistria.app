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
  color?: string;
	[rest: string]: any;
}

export const CompletionCard = ({
	title,
	description,
	percentage,
	footer,
  image,
  color = '',
	...rest
}: CompletionCardProps) => {
	const checkedClass =
		percentage === 100
			? 'border-brand/40 bg-brand/15'
			: '';

	return (
		<Card
      className={checkedClass}
      {...rest}>
			<div className='grid grid-cols-3 center-in-margin'>
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
            <CardHeader className='flex flex-row items-cnter justify-between space-y-0 pb-0'>
              <CardTitle className='text-sm font-semibold'>
                {title}
              </CardTitle>
            </CardHeader>

            <CardContent>
              <p className='text-2xl font-bold text-left'>
                {description}
              </p>

              <p className='text-xs font-medium text-foreground-muted'>
                {footer}
              </p>
            </CardContent>
          </div>
				</div>

				<div className='flex justify-end items-center p-5'>
					<PercentageIndicator
            className='h-16 w-16'
            percentage={percentage}
            color={color} />
				</div>
			</div>
		</Card>
	);
};
