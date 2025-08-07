// Packages
import {
  forwardRef,
  type ComponentPropsWithoutRef,
  type ComponentRef,
  type HTMLAttributes,
  type ReactElement
} from 'react';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { Cross2Icon } from '@radix-ui/react-icons';

// Local Imports
import { combineNames } from '../../lib/utils';

/**
 * Dialog component that provides a modal dialog interface.
 */
const Dialog = DialogPrimitive.Root;

/**
 * DialogTrigger component that opens the dialog when clicked.
 */
const DialogTrigger = DialogPrimitive.Trigger;

/**
 * DialogPortal component that renders the dialog in a portal.
 */
const DialogPortal = DialogPrimitive.Portal;

/**
 * DialogClose component that closes the dialog when clicked.
 */
const DialogClose = DialogPrimitive.Close;

/**
 * DialogOverlay component that provides a backdrop for the dialog.
 */
const DialogOverlay = forwardRef<
	ComponentRef<typeof DialogPrimitive.Overlay>,
	ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({
    className,
    ...props
  },
  ref,
): ReactElement => (
	<DialogPrimitive.Overlay
		ref={ref}
		className={combineNames(
			'fixed inset-0 z-50 bg-black/80  data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
			className,
		)}
		{...props} />
));

/**
 * DialogOverlay display name for debugging purposes.
 */
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName;

/**
 * DialogContent component that contains the main content of the dialog.
 */
const DialogContent = forwardRef<
	ComponentRef<typeof DialogPrimitive.Content>,
	ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(({
    className,
    children,
    ...props
  },
  ref,
): ReactElement => (
	<DialogPortal>
		<DialogOverlay />
		<DialogPrimitive.Content
			ref={ref}
			className={combineNames(
				'fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border border-neutral-200 bg-white p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg dark:border-neutral-800 dark:bg-neutral-950',
				className,
			)}
			{...props}>
			{children}

			<DialogPrimitive.Close className='absolute right-4 top-4 rounded-sm opacity-70 ring-offset-white transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-neutral-950 focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-neutral-100 data-[state=open]:text-neutral-500 dark:ring-offset-neutral-950 dark:focus:ring-neutral-300 dark:data-[state=open]:bg-neutral-800 dark:data-[state=open]:text-neutral-400'>
				<Cross2Icon className='h-4 w-4' />

				<span className='sr-only'>
          Close
        </span>
			</DialogPrimitive.Close>
		</DialogPrimitive.Content>
	</DialogPortal>
));

/**
 * DialogContent display name for debugging purposes.
 */
DialogContent.displayName = DialogPrimitive.Content.displayName;

/**
 * DialogHeader component that provides a header for the dialog.
 */
const DialogHeader = ({
	className,
	...props
}: HTMLAttributes<HTMLDivElement>) => (
	<div
		className={combineNames(
			'flex flex-col space-y-1.5 text-center sm:text-left mb-4',
			className,
		)}
		{...props} />
);

/**
 * DialogHeader display name for debugging purposes.
 */
DialogHeader.displayName = 'DialogHeader';


/**
 * DialogFooter component that provides a footer for the dialog.
 */
const DialogFooter = ({
	className,
	...props
}: HTMLAttributes<HTMLDivElement>) => (
	<div
		className={combineNames(
			'flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2',
			className,
		)}
		{...props} />
);

/**
 * DialogFooter display name for debugging purposes.
 */
DialogFooter.displayName = 'DialogFooter';

/**
 * DialogTitle component that provides a title for the dialog.
 */
const DialogTitle = forwardRef<
	ComponentRef<typeof DialogPrimitive.Title>,
	ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({
    className,
    ...props
  },
  ref,
): ReactElement => (
	<DialogPrimitive.Title
		ref={ref}
		className={combineNames(
			'text-lg font-semibold leading-none tracking-tight',
			className,
		)}
		{...props} />
));

/**
 * DialogTitle display name for debugging purposes.
 */
DialogTitle.displayName = DialogPrimitive.Title.displayName;

/**
 * DialogDescription component that provides a description for the dialog.
 */
const DialogDescription = forwardRef<
	ComponentRef<typeof DialogPrimitive.Description>,
	ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({
    className,
    ...props
  },
  ref,
): ReactElement => (
	<DialogPrimitive.Description
		ref={ref}
		className={combineNames('text-sm text-neutral-500 dark:text-neutral-400', className)}
		{...props} />
));

/**
 * DialogDescription display name for debugging purposes.
 */
DialogDescription.displayName = DialogPrimitive.Description.displayName;

export {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogOverlay,
	DialogPortal,
	DialogTitle,
	DialogTrigger,
};
