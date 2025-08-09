// Packages
import {
  forwardRef,
  type ComponentPropsWithoutRef,
  type ComponentRef,
} from 'react';
import * as ProgressPrimitive from '@radix-ui/react-progress';

// Local Imports
import { combineNames } from '../../lib/utils';

/**
 * Progress component that displays a progress bar.
 * It can be used to indicate the completion status of a task or operation.
 */
const Progress = forwardRef<
	ComponentRef<typeof ProgressPrimitive.Root>,
	ComponentPropsWithoutRef<typeof ProgressPrimitive.Root>
>(({
    className,
    value,
    max,
    ...props
  },
  ref,
) => (
	<div className='flex items-center space-x-2'>
		<ProgressPrimitive.Root
			ref={ref}
			className={combineNames(
				'relative flex h-2 w-full overflow-hidden rounded-full bg-neutral-900/20 dark:bg-neutral-50/20 ',
				className,
			)}
			{...props}>
			<ProgressPrimitive.Indicator
				className='h-full w-full flex-1 bg-neutral-900 transition-all dark:bg-neutral-50'
				style={{
					transform: `translateX(-${100 - (value && max ? (value / max) * 100 : 0)}%)`,
				}} />
		</ProgressPrimitive.Root>

		<span className='flex text-sm'>
			{typeof value === 'number' && typeof max === 'number'
				? `${value} / ${max}`
				: ``}
		</span>
	</div>
));

/**
 * Progress display name for debugging purposes.
 */
Progress.displayName = ProgressPrimitive.Root.displayName;

export { Progress };
