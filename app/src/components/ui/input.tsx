// Packages
import {
  forwardRef,
  type InputHTMLAttributes,
  type ReactElement,
} from 'react';

// Local Imports
import { combineNames } from '../../lib/utils';

/**
 * Input component that provides a styled input field.
 * It accepts all standard input attributes and applies custom styles.
 */
const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
	({
    className,
    type,
    ...props
  },
  ref
): ReactElement => (
  <input
    type={type}
    className={combineNames(
      'flex h-9 w-full rounded-md border border-neutral-200 bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-neutral-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-neutral-950 disabled:cursor-not-allowed disabled:opacity-50 dark:border-neutral-800 dark:placeholder:text-neutral-400 dark:focus-visible:ring-neutral-300',
      className,
    )}
    ref={ref}
    {...props} />
));

/**
 * Input display name for debugging purposes.
 */
Input.displayName = 'Input';

export { Input };
