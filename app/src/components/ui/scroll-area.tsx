// Packages
import {
  forwardRef,
  type ComponentPropsWithoutRef,
  type ComponentRef,
  type ReactElement,
} from 'react';
import * as ScrollAreaPrimitive from '@radix-ui/react-scroll-area';

// Local Imports
import { combineNames } from '../../lib/utils';

/**
 * ScrollArea component that provides a scrollable area with custom styles.
 * It uses Radix UI's ScrollArea primitives to create a scrollable container.
 */
const ScrollArea = forwardRef<
	ComponentRef<typeof ScrollAreaPrimitive.Root>,
	ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.Root>
>(({
    className,
    children,
    ...props
  },
  ref,
): ReactElement => (
	<ScrollAreaPrimitive.Root
		ref={ref}
		className={combineNames(
      'relative overflow-hidden',
      className,
    )}
		{...props}>
		<ScrollAreaPrimitive.Viewport className='h-full w-full rounded-[inherit]'>
			{children}
		</ScrollAreaPrimitive.Viewport>

		<ScrollBar />

		<ScrollAreaPrimitive.Corner />
	</ScrollAreaPrimitive.Root>
));

/**
 * ScrollArea display name for debugging purposes.
 */
ScrollArea.displayName = ScrollAreaPrimitive.Root.displayName;

/**
 * ScrollBar component that provides a scrollbar for the ScrollArea.
 * It uses Radix UI's ScrollAreaScrollbar primitive to create a scrollbar.
 */
const ScrollBar = forwardRef<
	ComponentRef<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>,
	ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>
>(({
    className,
    orientation = 'vertical',
    ...props
  },
  ref,
): ReactElement => (
	<ScrollAreaPrimitive.ScrollAreaScrollbar
		ref={ref}
		orientation={orientation}
		className={combineNames(
			'flex touch-none select-none transition-colors',
			orientation === 'vertical' &&
				'h-full w-2.5 border-l border-l-transparent p-[1px]',
			orientation === 'horizontal' &&
				'h-2.5 border-t border-t-transparent p-[1px]',
			className,
		)}
		{...props}>
		<ScrollAreaPrimitive.ScrollAreaThumb className='relative flex-1 rounded-full bg-neutral-200 dark:bg-neutral-800' />
	</ScrollAreaPrimitive.ScrollAreaScrollbar>
));

/**
 * ScrollBar display name for debugging purposes.
 */
ScrollBar.displayName = ScrollAreaPrimitive.ScrollAreaScrollbar.displayName;

export {
  ScrollArea,
  ScrollBar,
};
