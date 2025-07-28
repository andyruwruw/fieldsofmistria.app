// Packages
import {
  forwardRef,
  type ComponentPropsWithoutRef,
  type ComponentRef,
} from 'react';
import * as TooltipPrimitive from '@radix-ui/react-tooltip';

// Local Imports
import { combineNames } from '../../lib/utils';

/**
 * TooltipProvider component that provides context for tooltips.
 * It is used to wrap the application or a part of it to enable tooltip functionality.
 */
const TooltipProvider = TooltipPrimitive.Provider;

/**
 * Tooltip component that provides a tooltip interface.
 */
const Tooltip = TooltipPrimitive.Root;

/**
 * Tooltip display name for debugging purposes.
 */
const TooltipTrigger = TooltipPrimitive.Trigger;

/**
 * TooltipContent component that contains the content for the tooltip.
 */
const TooltipContent = forwardRef<
	ComponentRef<typeof TooltipPrimitive.Content>,
	ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>
>(({
    className,
    sideOffset = 4,
    ...props
  },
  ref,
) => (
	<TooltipPrimitive.Content
		ref={ref}
		sideOffset={sideOffset}
		className={combineNames(
			'z-50 overflow-hidden rounded-md bg-neutral-900 px-3 py-1.5 text-xs text-neutral-50 animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 dark:bg-neutral-50 dark:text-neutral-900',
			className,
		)}
		{...props} />
));

/**
 * TooltipContent display name for debugging purposes.
 */
TooltipContent.displayName = TooltipPrimitive.Content.displayName;

export {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
};
