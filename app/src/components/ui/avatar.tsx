// Packages
import {
  forwardRef,
  type ComponentPropsWithoutRef,
  type ComponentRef,
  type ReactElement,
} from 'react';
import * as AvatarPrimitive from '@radix-ui/react-avatar';

// Local Imports
import { combineNames } from '../../lib/utils';

/**
 * Avatar component that displays a user's profile picture or initials.
 * It can be used to represent users in various parts of the application.
 */
const Avatar = forwardRef<
	ComponentRef<typeof AvatarPrimitive.Root>,
	ComponentPropsWithoutRef<typeof AvatarPrimitive.Root>
>(({
    className,
    ...props
  },
  ref,
): ReactElement => (
	<AvatarPrimitive.Root
		ref={ref}
		className={combineNames(
			'relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full',
			className,
		)}
		{...props} />
));

/**
 * Avatar display name for debugging purposes.
 */
Avatar.displayName = AvatarPrimitive.Root.displayName;

/**
 * AvatarImage component that displays the user's profile image.
 * It falls back to the AvatarFallback if the image fails to load.
 */
const AvatarImage = forwardRef<
	ComponentRef<typeof AvatarPrimitive.Image>,
	ComponentPropsWithoutRef<typeof AvatarPrimitive.Image>
>(({
    className,
    ...props
  },
  ref,
): ReactElement => (
	<AvatarPrimitive.Image
		ref={ref}
		className={combineNames(
      'aspect-square h-full w-full',
      className,
    )}
		{...props} />
));

/**
 * AvatarImage display name for debugging purposes.
 */
AvatarImage.displayName = AvatarPrimitive.Image.displayName;

/**
 * AvatarFallback component that displays a fallback UI when the image fails to load.
 * It typically shows the user's initials or a placeholder icon.
 */
const AvatarFallback = forwardRef<
	ComponentRef<typeof AvatarPrimitive.Fallback>,
	ComponentPropsWithoutRef<typeof AvatarPrimitive.Fallback>
>(({
    className,
    ...props
  },
  ref,
): ReactElement => (
	<AvatarPrimitive.Fallback
		ref={ref}
		className={combineNames(
			'flex h-full w-full items-center justify-center rounded-full dark:bg-neutral-100 bg-neutral-800',
			className,
		)}
		{...props} />
));

/**
 * AvatarFallback display name for debugging purposes.
 */
AvatarFallback.displayName = AvatarPrimitive.Fallback.displayName;

export {
  Avatar,
  AvatarFallback,
  AvatarImage,
};
