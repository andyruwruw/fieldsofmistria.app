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
import * as ContextMenuPrimitive from '@radix-ui/react-context-menu';

// Local Imports
import { combineNames } from '../../../lib/utils';

/**
 * ContextMenu component that provides a context menu interface.
 */
const ContextMenu = ContextMenuPrimitive.Root;

/**
 * ContextMenuTrigger component that triggers the context menu.
 */
const ContextMenuTrigger = ContextMenuPrimitive.Trigger;

/**
 * ContextMenuGroup component that groups context menu items.
 */
const ContextMenuGroup = ContextMenuPrimitive.Group;

/**
 * ContextMenuPortal component that renders the context menu in a portal.
 */
const ContextMenuPortal = ContextMenuPrimitive.Portal;

/**
 * ContextMenuSub component that represents a sub-menu in the context menu.
 */
const ContextMenuSub = ContextMenuPrimitive.Sub;

/**
 * ContextMenuRadioGroup component that allows for radio button selection in the context menu.
 */
const ContextMenuRadioGroup = ContextMenuPrimitive.RadioGroup;

/**
 * ContextMenuSubTrigger component that triggers a sub-menu in the context menu.
 */
const ContextMenuSubTrigger = forwardRef<
	ComponentRef<typeof ContextMenuPrimitive.SubTrigger>,
	ComponentPropsWithoutRef<typeof ContextMenuPrimitive.SubTrigger> & {
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
	<ContextMenuPrimitive.SubTrigger
		ref={ref}
		className={combineNames(
			'flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-neutral-100 focus:text-neutral-900 data-[state=open]:bg-neutral-100 data-[state=open]:text-neutral-900 dark:focus:bg-neutral-800 dark:focus:text-neutral-50 dark:data-[state=open]:bg-neutral-800 dark:data-[state=open]:text-neutral-50',
			inset && 'pl-8',
			className,
		)}
		{...props}>
		{children}

		<ChevronRightIcon className='ml-auto h-4 w-4' />
	</ContextMenuPrimitive.SubTrigger>
));

/**
 * ContextMenuSubTrigger display name for debugging purposes.
 */
ContextMenuSubTrigger.displayName = ContextMenuPrimitive.SubTrigger.displayName;

/**
 * ContextMenuSubContent component that renders the content of a sub-menu.
 */
const ContextMenuSubContent = forwardRef<
	ComponentRef<typeof ContextMenuPrimitive.SubContent>,
	ComponentPropsWithoutRef<typeof ContextMenuPrimitive.SubContent>
>(({
    className,
    ...props
  },
  ref,
): ReactElement => (
	<ContextMenuPrimitive.SubContent
		ref={ref}
		className={combineNames(
			'z-50 min-w-[8rem] overflow-hidden rounded-md border border-neutral-200 bg-white p-1 text-neutral-950 shadow-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-50',
			className,
		)}
		{...props} />
));

/**
 * ContextMenuSubContent display name for debugging purposes.
 */
ContextMenuSubContent.displayName = ContextMenuPrimitive.SubContent.displayName;

/**
 * ContextMenuContent component that renders the main content of the context menu.
 */
const ContextMenuContent = forwardRef<
	ComponentRef<typeof ContextMenuPrimitive.Content>,
	ComponentPropsWithoutRef<typeof ContextMenuPrimitive.Content>
>(({
    className,
    ...props
  },
  ref,
): ReactElement => (
	<ContextMenuPrimitive.Portal>
		<ContextMenuPrimitive.Content
			ref={ref}
			className={combineNames(
				'z-50 min-w-[8rem] overflow-hidden rounded-md border border-neutral-200 bg-white p-1 text-neutral-950 shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-50',
				className,
			)}
			{...props} />
	</ContextMenuPrimitive.Portal>
));

/**
 * ContextMenuContent display name for debugging purposes.
 */
ContextMenuContent.displayName = ContextMenuPrimitive.Content.displayName;

/**
 * ContextMenuItem component that represents an item in the context menu.
 */
const ContextMenuItem = forwardRef<
	ComponentRef<typeof ContextMenuPrimitive.Item>,
	ComponentPropsWithoutRef<typeof ContextMenuPrimitive.Item> & {
		inset?: boolean;
	}
>(({
    className,
    inset,
    ...props
  },
  ref,
): ReactElement => (
	<ContextMenuPrimitive.Item
		ref={ref}
		className={combineNames(
			'relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-neutral-100 focus:text-neutral-900 data-[disabled]:pointer-events-none data-[disabled]:opacity-50 dark:focus:bg-neutral-800 dark:focus:text-neutral-50',
			inset && 'pl-8',
			className,
		)}
		{...props} />
));

/**
 * ContextMenuItem display name for debugging purposes.
 */
ContextMenuItem.displayName = ContextMenuPrimitive.Item.displayName;

/**
 * ContextMenuCheckboxItem component that represents a checkbox item in the context menu.
 */
const ContextMenuCheckboxItem = forwardRef<
	ComponentRef<typeof ContextMenuPrimitive.CheckboxItem>,
	ComponentPropsWithoutRef<typeof ContextMenuPrimitive.CheckboxItem>
>(({
    className,
    children,
    checked,
    ...props
  },
  ref,
): ReactElement => (
	<ContextMenuPrimitive.CheckboxItem
		ref={ref}
		className={combineNames(
			'relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-neutral-100 focus:text-neutral-900 data-[disabled]:pointer-events-none data-[disabled]:opacity-50 dark:focus:bg-neutral-800 dark:focus:text-neutral-50',
			className,
		)}
		checked={checked}
		{...props}>
		<span className='absolute left-2 flex h-3.5 w-3.5 items-center justify-center'>
			<ContextMenuPrimitive.ItemIndicator>
				<CheckIcon className='h-4 w-4' />
			</ContextMenuPrimitive.ItemIndicator>
		</span>

		{children}
	</ContextMenuPrimitive.CheckboxItem>
));

/**
 * ContextMenuCheckboxItem display name for debugging purposes.
 */
ContextMenuCheckboxItem.displayName = ContextMenuPrimitive.CheckboxItem.displayName;

/**
 * ContextMenuRadioItem component that represents a radio item in the context menu.
 */
const ContextMenuRadioItem = forwardRef<
	ComponentRef<typeof ContextMenuPrimitive.RadioItem>,
	ComponentPropsWithoutRef<typeof ContextMenuPrimitive.RadioItem>
>(({
    className,
    children,
    ...props
  },
  ref,
): ReactElement => (
	<ContextMenuPrimitive.RadioItem
		ref={ref}
		className={combineNames(
			'relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-neutral-100 focus:text-neutral-900 data-[disabled]:pointer-events-none data-[disabled]:opacity-50 dark:focus:bg-neutral-800 dark:focus:text-neutral-50',
			className,
		)}
		{...props}>
		<span className='absolute left-2 flex h-3.5 w-3.5 items-center justify-center'>
			<ContextMenuPrimitive.ItemIndicator>
				<DotFilledIcon className='h-4 w-4 fill-current' />
			</ContextMenuPrimitive.ItemIndicator>
		</span>

		{children}
	</ContextMenuPrimitive.RadioItem>
));

/**
 * ContextMenuRadioItem display name for debugging purposes.
 */
ContextMenuRadioItem.displayName = ContextMenuPrimitive.RadioItem.displayName;

/**
 * ContextMenuLabel component that represents a label in the context menu.
 */
const ContextMenuLabel = forwardRef<
	ComponentRef<typeof ContextMenuPrimitive.Label>,
	ComponentPropsWithoutRef<typeof ContextMenuPrimitive.Label> & {
		inset?: boolean;
	}
>(({
    className,
    inset,
    ...props
  },
  ref,
): ReactElement => (
	<ContextMenuPrimitive.Label
		ref={ref}
		className={combineNames(
			'px-2 py-1.5 text-sm font-semibold text-neutral-950 dark:text-neutral-50',
			inset && 'pl-8',
			className,
		)}
		{...props} />
));

/**
 * ContextMenuLabel display name for debugging purposes.
 */
ContextMenuLabel.displayName = ContextMenuPrimitive.Label.displayName;

/**
 * ContextMenuGroup component that groups context menu items.
 */
const ContextMenuSeparator = forwardRef<
	ComponentRef<typeof ContextMenuPrimitive.Separator>,
	ComponentPropsWithoutRef<typeof ContextMenuPrimitive.Separator>
>(({
    className,
    ...props
  },
  ref,
): ReactElement => (
	<ContextMenuPrimitive.Separator
		ref={ref}
		className={combineNames(
			'-mx-1 my-1 h-px bg-neutral-200 dark:bg-neutral-800',
			className,
		)}
		{...props} />
));

/**
 * ContextMenuGroup display name for debugging purposes.
 */
ContextMenuSeparator.displayName = ContextMenuPrimitive.Separator.displayName;

/**
 * ContextMenuShortcut component that displays a keyboard shortcut in the context menu.
 */
const ContextMenuShortcut = ({
	className,
	...props
}: HTMLAttributes<HTMLSpanElement>) => {
	return (
		<span
			className={combineNames(
				'ml-auto text-xs tracking-widest text-neutral-500 dark:text-neutral-400',
				className,
			)}
			{...props} />
	);
};

/**
 * ContextMenuShortcut display name for debugging purposes.
 */
ContextMenuShortcut.displayName = 'ContextMenuShortcut';

export {
	ContextMenu,
	ContextMenuCheckboxItem,
	ContextMenuContent,
	ContextMenuGroup,
	ContextMenuItem,
	ContextMenuLabel,
	ContextMenuPortal,
	ContextMenuRadioGroup,
	ContextMenuRadioItem,
	ContextMenuSeparator,
	ContextMenuShortcut,
	ContextMenuSub,
	ContextMenuSubContent,
	ContextMenuSubTrigger,
	ContextMenuTrigger,
};
