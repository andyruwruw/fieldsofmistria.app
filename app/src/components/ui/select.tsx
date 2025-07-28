// Packages
import {
  forwardRef,
  type ComponentPropsWithoutRef,
  type ComponentRef,
  type ReactElement,
} from 'react';
import {
  CaretSortIcon,
  CheckIcon,
} from '@radix-ui/react-icons';
import * as SelectPrimitive from '@radix-ui/react-select';

// Local Imports
import { combineNames } from '../../lib/utils';

/**
 * Select component that provides a dropdown selection interface.
 * It uses Radix UI's Select primitives to create a customizable select input.
 */
const Select = SelectPrimitive.Root;

/**
 * SelectGroup component that groups select items together.
 * It can be used to categorize options within the select dropdown.
 */
const SelectGroup = SelectPrimitive.Group;

/**
 * SelectValue component that displays the selected value in the select input.
 * It is used to show the currently selected option in the dropdown.
 */
const SelectValue = SelectPrimitive.Value;

/**
 * SelectTrigger component that triggers the dropdown to open or close.
 */
const SelectTrigger = forwardRef<
	ComponentRef<typeof SelectPrimitive.Trigger>,
	ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger>
>(({
    className,
    children,
    ...props
  },
  ref,
): ReactElement => (
	<SelectPrimitive.Trigger
		ref={ref}
		className={combineNames(
			'flex h-9 w-full items-center justify-between rounded-md border border-neutral-200 bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-white placeholder:text-neutral-500 focus:outline-none focus:ring-1 focus:ring-neutral-950 disabled:cursor-not-allowed disabled:opacity-50 dark:border-neutral-800 dark:ring-offset-neutral-950 dark:placeholder:text-neutral-400 dark:focus:ring-neutral-300',
			className,
		)}
		{...props}>
		{children}

		<SelectPrimitive.Icon asChild>
			<CaretSortIcon className='h-4 w-4 opacity-50' />
		</SelectPrimitive.Icon>
	</SelectPrimitive.Trigger>
));

/**
 * SelectTrigger display name for debugging purposes.
 */
SelectTrigger.displayName = SelectPrimitive.Trigger.displayName;

/**
 * SelectContent component that contains the dropdown options.
 * It is used to display the list of selectable items when the dropdown is open.
 */
const SelectContent = forwardRef<
	ComponentRef<typeof SelectPrimitive.Content>,
	ComponentPropsWithoutRef<typeof SelectPrimitive.Content>
>(({
    className,
    children,
    position = 'popper',
    ...props
  },
  ref,
): ReactElement => (
	<SelectPrimitive.Portal>
		<SelectPrimitive.Content
			ref={ref}
			className={combineNames(
				'relative z-50 min-w-[8rem] overflow-hidden rounded-md border border-neutral-200 bg-white text-neutral-950 shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-50',
				position === 'popper' &&
					'data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1',
				className,
			)}
			position={position}
			{...props}>
			<SelectPrimitive.Viewport
				className={combineNames(
					'p-1',
					position === 'popper' &&
						'h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]',
				)}>
				{children}
			</SelectPrimitive.Viewport>
		</SelectPrimitive.Content>
	</SelectPrimitive.Portal>
));

/**
 * SelectContent display name for debugging purposes.
 */
SelectContent.displayName = SelectPrimitive.Content.displayName;

/**
 * SelectLabel component that provides a label for the select input.
 * It can be used to describe the purpose of the select dropdown.
 */
const SelectLabel = forwardRef<
	ComponentRef<typeof SelectPrimitive.Label>,
	ComponentPropsWithoutRef<typeof SelectPrimitive.Label>
>(({
    className,
    ...props
  },
  ref,
): ReactElement => (
	<SelectPrimitive.Label
		ref={ref}
		className={combineNames('px-2 py-1.5 text-sm font-semibold', className)}
		{...props} />
));

/**
 * SelectLabel display name for debugging purposes.
 */
SelectLabel.displayName = SelectPrimitive.Label.displayName;

/**
 * SelectItem component that represents an individual option in the select dropdown.
 * It is used to create selectable items within the SelectContent.
 */
const SelectItem = forwardRef<
	ComponentRef<typeof SelectPrimitive.Item>,
	ComponentPropsWithoutRef<typeof SelectPrimitive.Item>
>(({
    className,
    children,
    ...props
  },
  ref,
): ReactElement => (
	<SelectPrimitive.Item
		ref={ref}
		className={combineNames(
			'relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none focus:bg-neutral-100 focus:text-neutral-900 data-[disabled]:pointer-events-none data-[disabled]:opacity-50 dark:focus:bg-neutral-800 dark:focus:text-neutral-50',
			className,
		)}
		{...props}>
		<span className='absolute right-2 flex h-3.5 w-3.5 items-center justify-center'>
			<SelectPrimitive.ItemIndicator>
				<CheckIcon className='h-4 w-4' />
			</SelectPrimitive.ItemIndicator>
		</span>

		<SelectPrimitive.ItemText>
      {children}
    </SelectPrimitive.ItemText>
	</SelectPrimitive.Item>
));

/**
 * SelectItem display name for debugging purposes.
 */
SelectItem.displayName = SelectPrimitive.Item.displayName;

/**
 * SelectSeparator component that provides a visual separator between select items.
 * It can be used to group options within the select dropdown.
 */
const SelectSeparator = forwardRef<
	ComponentRef<typeof SelectPrimitive.Separator>,
	ComponentPropsWithoutRef<typeof SelectPrimitive.Separator>
>(({
    className,
    ...props
  },
  ref,
): ReactElement => (
	<SelectPrimitive.Separator
		ref={ref}
		className={combineNames(
			'-mx-1 my-1 h-px bg-neutral-100 dark:bg-neutral-800',
			className,
		)}
		{...props} />
));

/**
 * SelectSeparator display name for debugging purposes.
 */
SelectSeparator.displayName = SelectPrimitive.Separator.displayName;

export {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectSeparator,
	SelectTrigger,
	SelectValue,
};
