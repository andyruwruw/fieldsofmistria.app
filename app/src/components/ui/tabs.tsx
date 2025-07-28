// Packages
import {
  forwardRef,
  type ComponentPropsWithoutRef,
  type ComponentRef,
  type ReactElement,
} from 'react';
import * as TabsPrimitive from '@radix-ui/react-tabs';

// Local Imports
import { combineNames } from '../../lib/utils';

/**
 * Tabs component that provides a tabbed interface.
 */
const Tabs = TabsPrimitive.Root;

/**
 * Tabs display name for debugging purposes.
 */
const TabsList = forwardRef<
	ComponentRef<typeof TabsPrimitive.List>,
	ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({
    className,
    ...props
  },
  ref,
): ReactElement => (
	<TabsPrimitive.List
		ref={ref}
		className={combineNames(
			'inline-flex h-9 items-center justify-center rounded-lg bg-neutral-100 p-1 text-neutral-500 dark:bg-neutral-800 dark:text-neutral-400',
			className,
		)}
		{...props} />
));

/**
 * TabsList display name for debugging purposes.
 */
TabsList.displayName = TabsPrimitive.List.displayName;

/**
 * TabsTrigger component that triggers the tab content.
 */
const TabsTrigger = forwardRef<
	ComponentRef<typeof TabsPrimitive.Trigger>,
	ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({
    className,
    ...props
  },
  ref,
): ReactElement => (
	<TabsPrimitive.Trigger
		ref={ref}
		className={combineNames(
			'inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium ring-offset-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-white data-[state=active]:text-neutral-950 data-[state=active]:shadow dark:ring-offset-neutral-950 dark:focus-visible:ring-neutral-300 dark:data-[state=active]:bg-neutral-950 dark:data-[state=active]:text-neutral-50',
			className,
		)}
		{...props} />
));

/**
 * TabsTrigger display name for debugging purposes.
 */
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName;

/**
 * TabsContent component that contains the content for each tab.
 */
const TabsContent = forwardRef<
	ComponentRef<typeof TabsPrimitive.Content>,
	ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({
    className,
    ...props
  },
  ref,
): ReactElement => (
	<TabsPrimitive.Content
		ref={ref}
		className={combineNames(
			'mt-2 ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-950 focus-visible:ring-offset-2 dark:ring-offset-neutral-950 dark:focus-visible:ring-neutral-300',
			className,
		)}
		{...props} />
));

/**
 * TabsContent display name for debugging purposes.
 */
TabsContent.displayName = TabsPrimitive.Content.displayName;

export {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
};
