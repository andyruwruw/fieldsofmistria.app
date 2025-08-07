// Packages
import {
  forwardRef,
  type ComponentPropsWithoutRef,
  type ComponentRef,
  type ReactElement,
} from 'react';
import {
  cva,
  type VariantProps,
} from 'class-variance-authority';
import { Cross2Icon } from '@radix-ui/react-icons';
import * as ToastPrimitives from '@radix-ui/react-toast';

// Local Imports
import { combineNames } from '../../lib/utils';

/**
 * Toast component that provides a notification system.
 */
const ToastProvider = ToastPrimitives.Provider;

/**
 * ToastViewport component that defines the area where toasts are displayed.
 * It uses Radix UI's ToastViewport primitive to create a viewport for the toasts.
 */
const ToastViewport = forwardRef<
	ComponentRef<typeof ToastPrimitives.Viewport>,
	ComponentPropsWithoutRef<typeof ToastPrimitives.Viewport>
>(({
    className,
    ...props
  },
  ref,
): ReactElement => (
	<ToastPrimitives.Viewport
		ref={ref}
		className={combineNames(
			'fixed top-0 z-[100] flex max-h-screen w-full flex-col-reverse p-4 sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col md:max-w-[420px]',
			className,
		)}
		{...props} />
));

/**
 * ToastViewport display name for debugging purposes.
 */
ToastViewport.displayName = ToastPrimitives.Viewport.displayName;

/**
 * Variants for the Toast component.
 * It defines the base styles and can be extended with additional classes.
 */
const toastVariants = cva(
	'group pointer-events-auto relative flex w-full items-center justify-between space-x-2 overflow-hidden rounded-md border border-neutral-200 p-4 pr-6 shadow-lg transition-all data-[swipe=cancel]:translate-x-0 data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)] data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=move]:transition-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[swipe=end]:animate-out data-[state=closed]:fade-out-80 data-[state=closed]:slide-out-to-right-full data-[state=open]:slide-in-from-top-full data-[state=open]:sm:slide-in-from-bottom-full dark:border-neutral-800',
	{
		variants: {
			variant: {
				default: 'border bg-white dark:bg-neutral-950',
				destructive:
					'destructive group border-red-500 bg-red-500 text-neutral-50 dark:border-red-900 dark:bg-red-900 dark:text-red-50',
			},
		},
		defaultVariants: {
			variant: 'default',
		},
	},
);

/**
 * Toast component that provides a notification system.
 * It can be used to display messages, alerts, or other notifications to the user.
 */
const Toast = forwardRef<
	ComponentRef<typeof ToastPrimitives.Root>,
	ComponentPropsWithoutRef<typeof ToastPrimitives.Root> &
		VariantProps<typeof toastVariants>
>(({
    className,
    variant,
    ...props
  },
  ref,
): ReactElement => (
  <ToastPrimitives.Root
    ref={ref}
    className={combineNames(toastVariants({ variant }), className)}
    {...props} />
));

/**
 * Toast display name for debugging purposes.
 */
Toast.displayName = ToastPrimitives.Root.displayName;

/**
 * ToastAction component that provides an action button for the toast.
 * It can be used to perform actions related to the toast notification.
 */
const ToastAction = forwardRef<
	ComponentRef<typeof ToastPrimitives.Action>,
	ComponentPropsWithoutRef<typeof ToastPrimitives.Action>
>(({
    className,
    ...props
  },
  ref,
): ReactElement => (
	<ToastPrimitives.Action
		ref={ref}
		className={combineNames(
			'inline-flex h-8 shrink-0 items-center justify-center rounded-md border border-neutral-200 bg-transparent px-3 text-sm font-medium transition-colors hover:bg-neutral-100 focus:outline-none focus:ring-1 focus:ring-neutral-400 disabled:pointer-events-none disabled:opacity-50 group-[.destructive]:border-neutral-100/40 group-[.destructive]:hover:border-red-500/30 group-[.destructive]:hover:bg-red-500 group-[.destructive]:hover:text-neutral-50 group-[.destructive]:focus:ring-red-500 dark:border-neutral-800 dark:hover:bg-neutral-800 dark:focus:ring-neutral-800 dark:group-[.destructive]:border-neutral-800/40 dark:group-[.destructive]:hover:border-red-900/30 dark:group-[.destructive]:hover:bg-red-900 dark:group-[.destructive]:hover:text-red-50 dark:group-[.destructive]:focus:ring-red-900',
			className,
		)}
		{...props} />
));

/**
 * ToastAction display name for debugging purposes.
 */
ToastAction.displayName = ToastPrimitives.Action.displayName;

/**
 * ToastClose component that provides a close button for the toast.
 * It allows users to dismiss the toast notification.
 */
const ToastClose = forwardRef<
	ComponentRef<typeof ToastPrimitives.Close>,
	ComponentPropsWithoutRef<typeof ToastPrimitives.Close>
>(({
    className,
    ...props
  },
  ref,
): ReactElement => (
	<ToastPrimitives.Close
		ref={ref}
		className={combineNames(
			'absolute right-1 top-1 rounded-md p-1 text-neutral-950/50 opacity-0 transition-opacity hover:text-neutral-950 focus:opacity-100 focus:outline-none focus:ring-1 group-hover:opacity-100 group-[.destructive]:text-red-300 group-[.destructive]:hover:text-red-50 group-[.destructive]:focus:ring-red-400 group-[.destructive]:focus:ring-offset-red-600 dark:text-neutral-50/50 dark:hover:text-neutral-50',
			className,
		)}
		toast-close=''
		{...props}>
		<Cross2Icon className='h-4 w-4' />
	</ToastPrimitives.Close>
));

/**
 * ToastClose display name for debugging purposes.
 */
ToastClose.displayName = ToastPrimitives.Close.displayName;

/**
 * ToastTitle component that provides a title for the toast.
 * It is used to display the main message or title of the toast notification.
 */
const ToastTitle = forwardRef<
	ComponentRef<typeof ToastPrimitives.Title>,
	ComponentPropsWithoutRef<typeof ToastPrimitives.Title>
>(({
    className,
    ...props
  },
  ref,
): ReactElement => (
	<ToastPrimitives.Title
		ref={ref}
		className={combineNames(
      'text-sm font-semibold [&+div]:text-xs',
      className,
    )}
		{...props} />
));

/**
 * ToastTitle display name for debugging purposes.
 */
ToastTitle.displayName = ToastPrimitives.Title.displayName;

/**
 * ToastDescription component that provides a description for the toast.
 * It is used to display additional information or context for the toast notification.
 */
const ToastDescription = forwardRef<
	ComponentRef<typeof ToastPrimitives.Description>,
	ComponentPropsWithoutRef<typeof ToastPrimitives.Description>
>(({
    className,
    ...props
  },
  ref,
): ReactElement => (
	<ToastPrimitives.Description
		ref={ref}
		className={combineNames(
      'text-sm opacity-90',
      className,
    )}
		{...props} />
));

/**
 * ToastDescription display name for debugging purposes.
 */
ToastDescription.displayName = ToastPrimitives.Description.displayName;

/**
 * Type definitions for the Toast component props.
 * It includes the base props and can be extended with additional properties.
 */
type ToastProps = ComponentPropsWithoutRef<typeof Toast>;

/**
 * Type definition for the ToastAction element.
 * It is used to define the type of the action element within the toast.
 */
type ToastActionElement = ReactElement<typeof ToastAction>;

export {
	Toast,
	ToastAction,
	ToastClose,
	ToastDescription,
	ToastProvider,
	ToastTitle,
	ToastViewport,
	type ToastActionElement,
	type ToastProps,
};
