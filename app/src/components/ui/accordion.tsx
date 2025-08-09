// Packages
import {
  forwardRef,
  type ComponentPropsWithoutRef,
  type ComponentRef,
  type ReactElement,
  type ReactNode,
} from 'react';
import * as AccordionPrimitive from '@radix-ui/react-accordion';
import { ChevronDownIcon } from '@radix-ui/react-icons';

// Local Imports
import { combineNames } from '../../lib/utils';

/**
 * Basic accordion component using Radix UI primitives.
 */
const Accordion = AccordionPrimitive.Root;

/**
 * AccordionItem component that represents a single item in the accordion.
 */
const AccordionItem = forwardRef<
	ComponentRef<typeof AccordionPrimitive.Item>,
	ComponentPropsWithoutRef<typeof AccordionPrimitive.Item>
>(({
    className,
    ...props
  },
  ref,
): ReactElement => (
	<AccordionPrimitive.Item
		ref={ref}
		className={combineNames(
      'border-b dark:border-neutral-800',
      className,
    )}
		{...props} />
));

/**
 * AccordionItem display name for debugging purposes.
 */
AccordionItem.displayName = 'AccordionItem';

/**
 * AccordionTrigger component that triggers the accordion item to open or close.
 * It can optionally display an icon on the right side.
 */
const AccordionTrigger = forwardRef<
	ComponentRef<typeof AccordionPrimitive.Trigger>,
	ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger> & {
		pullRight?: ReactNode;
	}
>(({
    className,
    children,
    pullRight,
    ...props
  },
  ref,
): React.ReactElement => (
	<AccordionPrimitive.Header className='flex'>
		<AccordionPrimitive.Trigger
			ref={ref}
			className={combineNames(
				'flex flex-1 items-center justify-between py-4 text-sm font-medium transition-all [&[data-state=open]>*>svg]:rotate-180 [&[data-state=open]>svg]:rotate-180',
				className,
			)}
			{...props}>
			{children}

			{pullRight ? (
				<div className='flex'>
					{pullRight}

					<ChevronDownIcon className=' ml-2 h-4 w-4 shrink-0 text-neutral-500 transition-transform duration-200 dark:text-neutral-400' />
				</div>
			) : (
				<ChevronDownIcon className='h-4 w-4 shrink-0 text-neutral-500 transition-transform duration-200 dark:text-neutral-400' />
			)}
		</AccordionPrimitive.Trigger>
	</AccordionPrimitive.Header>
));

/**
 * AccordionTrigger display name for debugging purposes.
 */
AccordionTrigger.displayName = AccordionPrimitive.Trigger.displayName;

/**
 * AccordionTriggerNoToggle component that does not toggle the accordion state.
 * It is used for displaying headers without the toggle functionality.
 */
const AccordionTriggerNoToggle = forwardRef<
	ComponentRef<typeof AccordionPrimitive.Trigger>,
	ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger>
>(({
    className,
    children,
    ...props
  },
  ref,
): ReactElement => (
	<AccordionPrimitive.Header className='flex'>
		<AccordionPrimitive.Trigger
			ref={ref}
			className={combineNames(
				'flex flex-1 items-center justify-between py-4 text-sm font-medium transition-all [&[data-state=open]>svg]:rotate-180 bg-transparent',
				className,
			)}
			{...props}>
			{children}
		</AccordionPrimitive.Trigger>
	</AccordionPrimitive.Header>
));

/**
 * AccordionTriggerNoToggle display name for debugging purposes.
 */
AccordionTriggerNoToggle.displayName = AccordionPrimitive.Trigger.displayName;

/**
 * AccordionContent component that displays the content of the accordion item.
 * It animates the opening and closing of the content.
 */
const AccordionContent = forwardRef<
	ComponentRef<typeof AccordionPrimitive.Content>,
	ComponentPropsWithoutRef<typeof AccordionPrimitive.Content>
>(({
    className,
    children,
    ...props
  },
  ref,
): ReactElement => (
	<AccordionPrimitive.Content
		ref={ref}
		className={combineNames(
			'overflow-hidden text-sm data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down',
			className,
		)}
		{...props}>
		<div className='pb-4 pt-0'>
      {children}
    </div>
	</AccordionPrimitive.Content>
));

/**
 * AccordionContent display name for debugging purposes.
 */
AccordionContent.displayName = AccordionPrimitive.Content.displayName;

// Exporting the components for use in other parts of the application
export {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
	AccordionTriggerNoToggle,
};
