// Packages
import {
  forwardRef,
  type ComponentPropsWithoutRef,
  type ComponentRef,
  type HTMLAttributes,
  type ReactElement,
} from 'react';
import { Command as CommandPrimitive } from 'cmdk';
import { MagnifyingGlassIcon } from '@radix-ui/react-icons';
import type { DialogProps } from '@radix-ui/react-dialog';

// Local Imports
import {
  Dialog,
  DialogContent,
} from './dialog';
import { combineNames } from '../../lib/utils';

/**
 * Command component that provides a command palette for searching and executing commands.
 * It can be used to quickly access features or perform actions within the application.
 */
const Command = forwardRef<
	ComponentRef<typeof CommandPrimitive>,
	ComponentPropsWithoutRef<typeof CommandPrimitive>
>(({
    className,
    ...props
  },
  ref,
): ReactElement => (
	<CommandPrimitive
		ref={ref}
		className={combineNames(
			'flex h-full w-full flex-col overflow-hidden rounded-md bg-white text-neutral-950 dark:bg-neutral-950 dark:text-neutral-50',
			className,
		)}
		{...props} />
));

/**
 * Command display name for debugging purposes.
 */
Command.displayName = CommandPrimitive.displayName;

type CommandDialogProps = DialogProps;

/**
 * CommandDialog component that wraps the Command component in a dialog.
 * It provides a modal interface for the command palette.
 *
 * @param {CommandDialogProps} props - The properties for the CommandDialog component.
 * @returns {ReactElement} The rendered CommandDialog component.
 */
const CommandDialog = ({
  children,
  ...props
}: CommandDialogProps): ReactElement=> {
	return (
		<Dialog {...props}>
			<DialogContent className='overflow-hidden p-0'>
				<Command className='[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-neutral-500 [&_[cmdk-group]:not([hidden])_~[cmdk-group]]:pt-0 [&_[cmdk-group]]:px-2 [&_[cmdk-input-wrapper]_svg]:h-5 [&_[cmdk-input-wrapper]_svg]:w-5 [&_[cmdk-input]]:h-12 [&_[cmdk-item]]:px-2 [&_[cmdk-item]]:py-3 [&_[cmdk-item]_svg]:h-5 [&_[cmdk-item]_svg]:w-5 dark:[&_[cmdk-group-heading]]:text-neutral-400'>
					{children}
				</Command>
			</DialogContent>
		</Dialog>
	);
};

/**
 * CommandDialog display name for debugging purposes.
 */
const CommandInput = forwardRef<
	ComponentRef<typeof CommandPrimitive.Input>,
	ComponentPropsWithoutRef<typeof CommandPrimitive.Input>
>(({
    className,
    ...props
  },
  ref,
): ReactElement => (
	<div
		className='flex items-center border-b px-3 dark:border-neutral-800'
		cmdk-input-wrapper=''>
		<MagnifyingGlassIcon className='mr-2 h-4 w-4 shrink-0 opacity-50' />

		<CommandPrimitive.Input
			ref={ref}
			className={combineNames(
				'flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-neutral-500 disabled:cursor-not-allowed disabled:opacity-50 dark:placeholder:text-neutral-400',
				className,
			)}
			{...props} />
	</div>
));

/**
 * CommandInput display name for debugging purposes.
 */
CommandInput.displayName = CommandPrimitive.Input.displayName;

/**
 * CommandList component that displays a list of command items.
 */
const CommandList = forwardRef<
	ComponentRef<typeof CommandPrimitive.List>,
	ComponentPropsWithoutRef<typeof CommandPrimitive.List>
>(({
    className,
    ...props
  },
  ref,
): ReactElement => (
	<CommandPrimitive.List
		ref={ref}
		className={combineNames(
      'max-h-[300px] overflow-y-auto overflow-x-hidden',
      className,
    )}
		{...props} />
));

/**
 * CommandList display name for debugging purposes.
 */
CommandList.displayName = CommandPrimitive.List.displayName;

/**
 * CommandEmpty component that displays a message when the command list is empty.
 */
const CommandEmpty = forwardRef<
	ComponentRef<typeof CommandPrimitive.Empty>,
	ComponentPropsWithoutRef<typeof CommandPrimitive.Empty>
>((
  props,
  ref,
): ReactElement => (
	<CommandPrimitive.Empty
		ref={ref}
		className='py-6 text-center text-sm'
		{...props} />
));

/**
 * CommandEmpty display name for debugging purposes.
 */
CommandEmpty.displayName = CommandPrimitive.Empty.displayName;

/**
 * CommandGroup component that groups a set of command items.
 */
const CommandGroup = forwardRef<
	ComponentRef<typeof CommandPrimitive.Group>,
	ComponentPropsWithoutRef<typeof CommandPrimitive.Group>
>(({
    className,
    ...props
  },
  ref,
): ReactElement => (
	<CommandPrimitive.Group
		ref={ref}
		className={combineNames(
			'overflow-hidden p-1 text-neutral-950 [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-neutral-500 dark:text-neutral-50 dark:[&_[cmdk-group-heading]]:text-neutral-400',
			className,
		)}
		{...props} />
));

/**
 * CommandGroup display name for debugging purposes.
 */
CommandGroup.displayName = CommandPrimitive.Group.displayName;

/**
 * CommandSeparator component that separates command items.
 */
const CommandSeparator = forwardRef<
	ComponentRef<typeof CommandPrimitive.Separator>,
	ComponentPropsWithoutRef<typeof CommandPrimitive.Separator>
>(({
    className,
    ...props
  },
  ref,
): ReactElement => (
	<CommandPrimitive.Separator
		ref={ref}
		className={combineNames('-mx-1 h-px bg-neutral-200 dark:bg-neutral-800', className)}
		{...props} />
));

/**
 * CommandSeparator display name for debugging purposes.
 */
CommandSeparator.displayName = CommandPrimitive.Separator.displayName;

/**
 * CommandItem component that represents a single command item.
 */
const CommandItem = forwardRef<
	ComponentRef<typeof CommandPrimitive.Item>,
	ComponentPropsWithoutRef<typeof CommandPrimitive.Item>
>(({
    className,
    ...props
  },
  ref,
): ReactElement => (
	<CommandPrimitive.Item
		ref={ref}
		className={combineNames(
			'relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none aria-selected:bg-neutral-100 aria-selected:text-neutral-900 data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50 dark:aria-selected:bg-neutral-800 dark:aria-selected:text-neutral-50',
			className,
		)}
		{...props} />
));

/**
 * CommandItem display name for debugging purposes.
 */
CommandItem.displayName = CommandPrimitive.Item.displayName;

/**
 * CommandShortcut component that displays a keyboard shortcut for a command.
 */
const CommandShortcut = ({
	className,
	...props
}: HTMLAttributes<HTMLSpanElement>): ReactElement => {
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
 * CommandShortcut display name for debugging purposes.
 */
CommandShortcut.displayName = 'CommandShortcut';

export {
	Command,
	CommandDialog,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
	CommandSeparator,
	CommandShortcut,
};
