// Packages
import {
  forwardRef,
  type ComponentPropsWithoutRef,
  type ComponentRef,
  type HTMLAttributes,
  type ReactElement,
} from 'react';
import {
  cva,
  type VariantProps,
} from 'class-variance-authority';
import { Cross2Icon } from '@radix-ui/react-icons';
import * as SheetPrimitive from '@radix-ui/react-dialog';

// Local Imports
import { combineNames } from '../../lib/utils';

/**
 * Sheet component that provides a modal sheet interface.
 */
const Sheet = SheetPrimitive.Root;

/**
 * Sheet trigger component that opens the sheet when clicked.
 */
const SheetTrigger = SheetPrimitive.Trigger;

/**
 * SheetClose component that closes the sheet when clicked.
 */
const SheetClose = SheetPrimitive.Close;

/**
 * SheetPortal component that renders the sheet in a portal.
 */
const SheetPortal = SheetPrimitive.Portal;

/**
 * Variants for the Sheet component.
 * It defines the base styles and can be extended with additional classes.
 */
const sheetVariants = cva(
	'fixed z-50 gap-4 bg-white p-6 shadow-lg transition ease-in-out data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:duration-300 data-[state=open]:duration-500 dark:bg-neutral-950 dark:border-neutral-800',
	{
		variants: {
			side: {
				top: 'inset-x-0 top-0 border-b data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top',
				bottom:
					'inset-x-0 bottom-0 border-t data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom',
				left: 'inset-y-0 left-0 h-full w-3/4 border-r data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left sm:max-w-sm',
				right:
					'inset-y-0 right-0 h-full w-3/4 border-l data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right sm:max-w-sm',
			},
		},
		defaultVariants: {
			side: 'right',
		},
	},
);

/**
 * SheetOverlay component that provides a backdrop for the sheet.
 */
const SheetOverlay = forwardRef<
	ComponentRef<typeof SheetPrimitive.Overlay>,
	ComponentPropsWithoutRef<typeof SheetPrimitive.Overlay>
>(({
    className,
    ...props
  },
  ref,
): ReactElement => (
	<SheetPrimitive.Overlay
		className={combineNames(
			'fixed inset-0 z-50 bg-black/80  data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
			className,
		)}
    ref={ref}
		{...props} />
));

/**
 * SheetOverlay display name for debugging purposes.
 */
SheetOverlay.displayName = SheetPrimitive.Overlay.displayName;

/**
 * Props for the SheetContent component.
 */
interface SheetContentProps extends ComponentPropsWithoutRef<typeof SheetPrimitive.Content>, VariantProps<typeof sheetVariants> {}

/**
 * SheetContent component that contains the main content of the sheet.
 */
const SheetContent = forwardRef<
	ComponentRef<typeof SheetPrimitive.Content>,
	SheetContentProps
>(({
    side = 'right',
    className,
    children,
    ...props
  },
  ref,
): ReactElement => (
	<SheetPortal>
		<SheetOverlay />
		<SheetPrimitive.Content
			ref={ref}
			className={combineNames(
        sheetVariants({ side }),
        className,
      )}
			{...props}>
			{children}

			<SheetPrimitive.Close className='absolute right-4 top-4 rounded-sm opacity-70 ring-offset-white transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-neutral-950 focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-neutral-100 dark:ring-offset-neutral-950 dark:focus:ring-neutral-300 dark:data-[state=open]:bg-neutral-800'>
				<Cross2Icon className='h-4 w-4' />

				<span className='sr-only'>
          Close
        </span>
			</SheetPrimitive.Close>
		</SheetPrimitive.Content>
	</SheetPortal>
));

/**
 * SheetContent display name for debugging purposes.
 */
SheetContent.displayName = SheetPrimitive.Content.displayName;

/**
 * SheetHeader component that provides a header for the sheet.
 */
const SheetHeader = ({
	className,
	...props
}: HTMLAttributes<HTMLDivElement>) => (
	<div
		className={combineNames(
			'flex flex-col space-y-2 text-center sm:text-left',
			className,
		)}
		{...props} />
);

/**
 * SheetHeader display name for debugging purposes.
 */
SheetHeader.displayName = 'SheetHeader';

/**
 * SheetFooter component that provides a footer for the sheet.
 */
const SheetFooter = ({
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
 * SheetFooter display name for debugging purposes.
 */
SheetFooter.displayName = 'SheetFooter';

/**
 * SheetTitle component that provides a title for the sheet.
 */
const SheetTitle = forwardRef<
	ComponentRef<typeof SheetPrimitive.Title>,
	ComponentPropsWithoutRef<typeof SheetPrimitive.Title>
>(({
    className,
    ...props
  },
  ref,
): ReactElement => (
	<SheetPrimitive.Title
		ref={ref}
		className={combineNames(
			'text-lg font-semibold text-neutral-950 dark:text-neutral-50',
			className,
		)}
		{...props} />
));

/**
 * SheetTitle display name for debugging purposes.
 */
SheetTitle.displayName = SheetPrimitive.Title.displayName;

/**
 * SheetDescription component that provides a description for the sheet.
 */
const SheetDescription = forwardRef<
	ComponentRef<typeof SheetPrimitive.Description>,
	ComponentPropsWithoutRef<typeof SheetPrimitive.Description>
>(({
    className,
    ...props
  },
  ref,
): ReactElement => (
	<SheetPrimitive.Description
		ref={ref}
		className={combineNames(
      'text-sm text-neutral-500 dark:text-neutral-400',
      className,
    )}
		{...props} />
));

/**
 * SheetDescription display name for debugging purposes.
 */
SheetDescription.displayName = SheetPrimitive.Description.displayName;

export {
	Sheet,
	SheetClose,
	SheetContent,
	SheetDescription,
	SheetFooter,
	SheetHeader,
	SheetOverlay,
	SheetPortal,
	SheetTitle,
	SheetTrigger,
};
