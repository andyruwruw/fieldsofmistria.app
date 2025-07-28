// Packages
import {
  forwardRef,
  type HTMLAttributes,
  type ReactElement,
} from 'react';

// Local Imports
import { combineNames } from '../../lib/utils';

/**
 * Card component that provides a styled container for content.
 * It can be used to display information, images, or other components.
 */
const Card = forwardRef<
	HTMLDivElement,
	HTMLAttributes<HTMLDivElement>
>(({
    className,
    ...props
  },
  ref,
): ReactElement => (
	<div
		ref={ref}
		className={combineNames(
			'rounded-xl border border-neutral-200 bg-white text-neutral-950 shadow dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-50',
			className,
		)}
		{...props} />
));

/**
 * Card display name for debugging purposes.
 */
Card.displayName = 'Card';

/**
 * CardHeader component that provides a header section for the card.
 * It can contain titles, descriptions, or other header elements.
 */
const CardHeader = forwardRef<
	HTMLDivElement,
	HTMLAttributes<HTMLDivElement>
>(({
    className,
    ...props
  },
  ref,
): ReactElement => (
	<div
		ref={ref}
		className={combineNames(
      'flex flex-col space-y-1.5 p-5',
      className,
    )}
		{...props} />
));

/**
 * CardHeader display name for debugging purposes.
 */
CardHeader.displayName = 'CardHeader';


/**
 * CardTitle component that provides a title for the card.
 * It is typically used to display the main heading of the card.
 */
const CardTitle = forwardRef<
	HTMLParagraphElement,
	HTMLAttributes<HTMLHeadingElement>
>(({
    className,
    ...props
  },
  ref,
): ReactElement => (
	<h3
		ref={ref}
		className={combineNames(
      'font-semibold leading-none tracking-tight',
      className,
    )}
		{...props} />
));

/**
 * CardTitle display name for debugging purposes.
 */
CardTitle.displayName = 'CardTitle';

/**
 * CardDescription component that provides a description for the card.
 * It is typically used to display additional information about the card.
 */
const CardDescription = forwardRef<
	HTMLParagraphElement,
	HTMLAttributes<HTMLParagraphElement>
>(({
    className,
    ...props
  },
  ref,
): ReactElement => (
	<p
		ref={ref}
		className={combineNames(
      'text-sm text-neutral-500 dark:text-neutral-400',
      className,
    )}
		{...props} />
));

/**
 * CardDescription display name for debugging purposes.
 */
CardDescription.displayName = 'CardDescription';

/**
 * CardContent component that provides the main content area for the card.
 * It is typically used to display the primary information or elements within the card.
 */
const CardContent = forwardRef<
	HTMLDivElement,
	HTMLAttributes<HTMLDivElement>
>(({
    className,
    ...props
  },
  ref,
): ReactElement => (
	<div
    ref={ref}
    className={combineNames(
      'p-5 pt-0',
      className,
    )}
    {...props} />
));

/**
 * CardContent display name for debugging purposes.
 */
CardContent.displayName = 'CardContent';

/**
 * CardFooter component that provides a footer section for the card.
 * It can contain actions, links, or other footer elements.
 */
const CardFooter = forwardRef<
	HTMLDivElement,
	HTMLAttributes<HTMLDivElement>
>(({
    className,
    ...props
  },
  ref,
): ReactElement => (
	<div
		ref={ref}
		className={combineNames(
      'flex items-center p-5 pt-0',
      className,
    )}
		{...props} />
));

/**
 * CardFooter display name for debugging purposes.
 */
CardFooter.displayName = 'CardFooter';

export {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
};
