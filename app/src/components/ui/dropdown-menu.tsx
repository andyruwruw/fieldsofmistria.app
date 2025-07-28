// Packages
import {
  forwardRef,
  type ComponentPropsWithoutRef,
  type ComponentRef,
  type HTMLAttributes,
  type ReactElement,
} from 'react';
import {
	CheckIcon,
	ChevronRightIcon,
	DotFilledIcon,
} from '@radix-ui/react-icons';
import * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu';

// Local Imports
import { combineNames } from '../../lib/utils';

/**
 * DropdownMenu component that provides a dropdown menu interface.
 */
const DropdownMenu = DropdownMenuPrimitive.Root;

/**
 * DropdownMenuTrigger component that opens the dropdown menu when clicked.
 */
const DropdownMenuTrigger = DropdownMenuPrimitive.Trigger;

/**
 * DropdownMenuGroup component that groups related menu items.
 */
const DropdownMenuGroup = DropdownMenuPrimitive.Group;

/**
 * DropdownMenuPortal component that renders the dropdown menu in a portal.
 */
const DropdownMenuPortal = DropdownMenuPrimitive.Portal;

/**
 * DropdownMenuSub component that represents a submenu in the dropdown menu.
 */
const DropdownMenuSub = DropdownMenuPrimitive.Sub;

/**
 * DropdownMenuRadioGroup component that allows for radio button selection within the dropdown menu.
 */
const DropdownMenuRadioGroup = DropdownMenuPrimitive.RadioGroup;

/**
 * DropdownMenuSubTrigger component that triggers the submenu to open or close.
 * It can optionally display an icon on the right side.
 */
const DropdownMenuSubTrigger = forwardRef<
	ComponentRef<typeof DropdownMenuPrimitive.SubTrigger>,
	ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.SubTrigger> & {
		inset?: boolean;
	}
>(({
    className,
    inset,
    children,
    ...props
  },
  ref,
): ReactElement => (
	<DropdownMenuPrimitive.SubTrigger
		ref={ref}
		className={combineNames(
			'flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-neutral-100 data-[state=open]:bg-neutral-100 dark:focus:bg-neutral-800 dark:data-[state=open]:bg-neutral-800',
			inset && 'pl-8',
			className,
		)}
		{...props}>
		{children}
		<ChevronRightIcon className='ml-auto h-4 w-4' />
	</DropdownMenuPrimitive.SubTrigger>
));

/**
 * DropdownMenuSubTrigger display name for debugging purposes.
 */
DropdownMenuSubTrigger.displayName = DropdownMenuPrimitive.SubTrigger.displayName;

/**
 * DropdownMenuSubContent component that contains the content of the submenu.
 */
const DropdownMenuSubContent = forwardRef<
	ComponentRef<typeof DropdownMenuPrimitive.SubContent>,
	ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.SubContent>
>(({
    className,
    ...props
  },
  ref,
): ReactElement => (
	<DropdownMenuPrimitive.SubContent
		ref={ref}
		className={combineNames(
			'z-50 min-w-[8rem] overflow-hidden rounded-md border border-neutral-200 bg-white p-1 text-neutral-950 shadow-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-50',
			className,
		)}
		{...props} />
));

/**
 * DropdownMenuSubContent display name for debugging purposes.
 */
DropdownMenuSubContent.displayName = DropdownMenuPrimitive.SubContent.displayName;

/**
 * DropdownMenuContent component that contains the main content of the dropdown menu.
 */
const DropdownMenuContent = forwardRef<
	ComponentRef<typeof DropdownMenuPrimitive.Content>,
	ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Content>
>(({
    className,
    sideOffset = 4,
    ...props
  },
  ref,
): ReactElement => (
	<DropdownMenuPrimitive.Portal>
		<DropdownMenuPrimitive.Content
			ref={ref}
			sideOffset={sideOffset}
			className={combineNames(
				'z-50 min-w-[8rem] overflow-hidden rounded-md border border-neutral-200 bg-white p-1 text-neutral-950 shadow-md dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-50',
				'data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
				className,
			)}
			{...props} />
	</DropdownMenuPrimitive.Portal>
));

/**
 * DropdownMenuContent display name for debugging purposes.
 */
DropdownMenuContent.displayName = DropdownMenuPrimitive.Content.displayName;

/**
 * DropdownMenuItem component that represents a single item in the dropdown menu.
 * It can optionally be inset to align with submenus.
 */
const DropdownMenuItem = forwardRef<
	ComponentRef<typeof DropdownMenuPrimitive.Item>,
	ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Item> & {
		inset?: boolean;
	}
>(({
    className,
    inset,
    ...props
  },
  ref,
): ReactElement => (
	<DropdownMenuPrimitive.Item
		ref={ref}
		className={combineNames(
			'relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-neutral-100 focus:text-neutral-900 data-[disabled]:pointer-events-none data-[disabled]:opacity-50 dark:focus:bg-neutral-800 dark:focus:text-neutral-50',
			inset && 'pl-8',
			className,
		)}
		{...props} />
));

/**
 * DropdownMenuItem display name for debugging purposes.
 */
DropdownMenuItem.displayName = DropdownMenuPrimitive.Item.displayName;

/**
 * DropdownMenuCheckboxItem component that represents a checkbox item in the dropdown menu.
 * It can be checked or unchecked and displays a check icon when checked.
 */
const DropdownMenuCheckboxItem = forwardRef<
	ComponentRef<typeof DropdownMenuPrimitive.CheckboxItem>,
	ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.CheckboxItem>
>(({
    className,
    children,
    checked,
    ...props
  },
  ref,
): ReactElement => (
	<DropdownMenuPrimitive.CheckboxItem
		ref={ref}
		className={combineNames(
			'relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-neutral-100 focus:text-neutral-900 data-[disabled]:pointer-events-none data-[disabled]:opacity-50 dark:focus:bg-neutral-800 dark:focus:text-neutral-50',
			className,
		)}
		checked={checked}
		{...props}>
		<span className='absolute left-2 flex h-3.5 w-3.5 items-center justify-center'>
			<DropdownMenuPrimitive.ItemIndicator>
				<CheckIcon className='h-4 w-4' />
			</DropdownMenuPrimitive.ItemIndicator>
		</span>

		{children}
	</DropdownMenuPrimitive.CheckboxItem>
));

/**
 * DropdownMenuCheckboxItem display name for debugging purposes.
 */
DropdownMenuCheckboxItem.displayName = DropdownMenuPrimitive.CheckboxItem.displayName;

/**
 * DropdownMenuRadioItem component that represents a radio item in the dropdown menu.
 * It can be selected and displays a dot icon when selected.
 */
const DropdownMenuRadioItem = forwardRef<
	ComponentRef<typeof DropdownMenuPrimitive.RadioItem>,
	ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.RadioItem>
>(({
    className,
    children,
    ...props
  },
  ref,
): ReactElement => (
	<DropdownMenuPrimitive.RadioItem
		ref={ref}
		className={combineNames(
			'relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-neutral-100 focus:text-neutral-900 data-[disabled]:pointer-events-none data-[disabled]:opacity-50 dark:focus:bg-neutral-800 dark:focus:text-neutral-50',
			className,
		)}
		{...props}>
		<span className='absolute left-2 flex h-3.5 w-3.5 items-center justify-center'>
			<DropdownMenuPrimitive.ItemIndicator>
				<DotFilledIcon className='h-4 w-4 fill-current' />
			</DropdownMenuPrimitive.ItemIndicator>
		</span>

		{children}
	</DropdownMenuPrimitive.RadioItem>
));

/**
 * DropdownMenuRadioItem display name for debugging purposes.
 */
DropdownMenuRadioItem.displayName = DropdownMenuPrimitive.RadioItem.displayName;

/**
 * DropdownMenuGroup component that groups related items in the dropdown menu.
 */
const DropdownMenuLabel = forwardRef<
	ComponentRef<typeof DropdownMenuPrimitive.Label>,
	ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Label> & {
		inset?: boolean;
	}
>(({
    className,
    inset,
    ...props
  },
  ref,
): ReactElement => (
	<DropdownMenuPrimitive.Label
		ref={ref}
		className={combineNames(
			'px-2 py-1.5 text-sm font-semibold',
			inset && 'pl-8',
			className,
		)}
		{...props} />
));

/**
 * DropdownMenuGroup display name for debugging purposes.
 */
DropdownMenuLabel.displayName = DropdownMenuPrimitive.Label.displayName;

/**
 * DropdownMenuGroup component that groups related items in the dropdown menu.
 */
const DropdownMenuSeparator = forwardRef<
	ComponentRef<typeof DropdownMenuPrimitive.Separator>,
	ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Separator>
>(({
    className,
    ...props
  },
  ref,
): ReactElement => (
	<DropdownMenuPrimitive.Separator
		ref={ref}
		className={combineNames(
			'-mx-1 my-1 h-px bg-neutral-100 dark:bg-neutral-800',
			className,
		)}
		{...props} />
));

/**
 * DropdownMenuSeparator display name for debugging purposes.
 */
DropdownMenuSeparator.displayName = DropdownMenuPrimitive.Separator.displayName;

/**
 * DropdownMenuShortcut component that displays a keyboard shortcut for the menu item.
 * It is typically used to indicate the action associated with the menu item.
 */
const DropdownMenuShortcut = ({
	className,
	...props
}: HTMLAttributes<HTMLSpanElement>) => (
  <span
    className={combineNames('ml-auto text-xs tracking-widest opacity-60', className)}
    {...props} />
);

/**
 * DropdownMenuShortcut display name for debugging purposes.
 */
DropdownMenuShortcut.displayName = 'DropdownMenuShortcut';

export {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuPortal,
	DropdownMenuRadioGroup,
	DropdownMenuRadioItem,
	DropdownMenuSeparator,
	DropdownMenuShortcut,
	DropdownMenuSub,
	DropdownMenuSubContent,
	DropdownMenuSubTrigger,
	DropdownMenuTrigger,
};
