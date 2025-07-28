// Packages
import {
  forwardRef,
  type ComponentProps,
  type ComponentPropsWithoutRef,
  type ComponentRef,
  type HTMLAttributes,
  type ReactElement,
} from 'react';
import { Drawer as DrawerPrimitive } from 'vaul';

// Local Imports
import { combineNames } from '../../lib/utils';

/**
 * Drawer component that provides a modal drawer interface.
 */
const Drawer = ({
	shouldScaleBackground = true,
	...props
}: ComponentProps<typeof DrawerPrimitive.Root>) => (
	<DrawerPrimitive.Root
		shouldScaleBackground={shouldScaleBackground}
		{...props} />
);

/**
 * Drawer display name for debugging purposes.
 */
Drawer.displayName = 'Drawer';

/**
 * DrawerTrigger component that opens the drawer when clicked.
 */
const DrawerTrigger = DrawerPrimitive.Trigger;

/**
 * DrawerPortal component that renders the drawer in a portal.
 */
const DrawerPortal = DrawerPrimitive.Portal;

/**
 * DrawerClose component that closes the drawer when clicked.
 */
const DrawerClose = DrawerPrimitive.Close;

/**
 * DrawerOverlay component that provides a backdrop for the drawer.
 */
const DrawerOverlay = forwardRef<
	ComponentRef<typeof DrawerPrimitive.Overlay>,
	ComponentPropsWithoutRef<typeof DrawerPrimitive.Overlay>
>(({
    className,
    ...props
  },
  ref,
): ReactElement => (
	<DrawerPrimitive.Overlay
		ref={ref}
		className={combineNames(
      'fixed inset-0 z-50 bg-black/80',
      className,
    )}
		{...props} />
));

/**
 * DrawerOverlay display name for debugging purposes.
 */
DrawerOverlay.displayName = DrawerPrimitive.Overlay.displayName;

/**
 * DrawerContent component that contains the main content of the drawer.
 */
const DrawerContent = forwardRef<
	ComponentRef<typeof DrawerPrimitive.Content>,
	ComponentPropsWithoutRef<typeof DrawerPrimitive.Content>
>(({
    className,
    children,
    ...props
  },
  ref,
): ReactElement => (
	<DrawerPortal>
		<DrawerOverlay />
		<DrawerPrimitive.Content
			ref={ref}
			className={combineNames(
				'fixed inset-x-0 bottom-0 z-50 mt-24 flex h-auto flex-col rounded-t-[10px] border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-950',
				className,
			)}
			{...props}>
			<div className='mx-auto mt-4 h-2 w-[100px] rounded-full bg-neutral-100 dark:bg-neutral-800' />

			{children}
		</DrawerPrimitive.Content>
	</DrawerPortal>
));

/**
 * DrawerContent display name for debugging purposes.
 */
DrawerContent.displayName = 'DrawerContent';

/**
 * DrawerHeader component that provides a header section for the drawer.
 * It can contain titles, descriptions, or other header elements.
 */
const DrawerHeader = ({
	className,
	...props
}: HTMLAttributes<HTMLDivElement>) => (
	<div
		className={combineNames(
      'grid gap-1.5 p-4 text-center sm:text-left',
      className,
    )}
		{...props} />
);

/**
 * DrawerHeader display name for debugging purposes.
 */
DrawerHeader.displayName = 'DrawerHeader';

/**
 * DrawerFooter component that provides a footer section for the drawer.
 * It can contain buttons or other elements at the bottom of the drawer.
 */
const DrawerFooter = ({
	className,
	...props
}: HTMLAttributes<HTMLDivElement>) => (
	<div
		className={combineNames(
      'mt-auto flex flex-col gap-2 p-4',
      className,
    )}
		{...props} />
);

/**
 * DrawerFooter display name for debugging purposes.
 */
DrawerFooter.displayName = 'DrawerFooter';

/**
 * DrawerTitle component that provides a title for the drawer.
 */
const DrawerTitle = forwardRef<
	ComponentRef<typeof DrawerPrimitive.Title>,
	ComponentPropsWithoutRef<typeof DrawerPrimitive.Title>
>(({
    className,
    ...props
  },
  ref,
): ReactElement => (
	<DrawerPrimitive.Title
		ref={ref}
		className={combineNames(
			'text-lg font-semibold leading-none tracking-tight',
			className,
		)}
		{...props} />
));

/**
 * DrawerTitle display name for debugging purposes.
 */
DrawerTitle.displayName = DrawerPrimitive.Title.displayName;


/**
 * DrawerDescription component that provides a description for the drawer.
 */
const DrawerDescription = forwardRef<
	ComponentRef<typeof DrawerPrimitive.Description>,
	ComponentPropsWithoutRef<typeof DrawerPrimitive.Description>
>(({
    className,
    ...props
  },
  ref,
): ReactElement => (
	<DrawerPrimitive.Description
		ref={ref}
		className={combineNames(
      'text-sm text-neutral-500 dark:text-neutral-400',
      className,
    )}
		{...props} />
));

/**
 * DrawerDescription display name for debugging purposes.
 */
DrawerDescription.displayName = DrawerPrimitive.Description.displayName;

export {
	Drawer,
	DrawerClose,
	DrawerContent,
	DrawerDescription,
	DrawerFooter,
	DrawerHeader,
	DrawerOverlay,
	DrawerPortal,
	DrawerTitle,
	DrawerTrigger,
};
