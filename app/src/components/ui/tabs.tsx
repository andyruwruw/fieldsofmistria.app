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
			'inline-flex h-9 items-center justify-center rounded-lg bg-muted p-1 text-foreground-muted',
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
			'inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-surface data-[state=active]:text-foreground data-[state=active]:shadow',
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
			'mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
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
