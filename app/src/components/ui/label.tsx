// Packges
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
import * as LabelPrimitive from '@radix-ui/react-label';

// Local Imports
import { combineNames } from '../../lib/utils';

/**
 * Variants for the Label component.
 * It defines the base styles and can be extended with additional classes.
 */
const labelVariants = cva(
	'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
);

/**
 * Label component that provides a styled label for form elements.
 * It can be used to associate text with form controls.
 */
const Label = forwardRef<
	ComponentRef<typeof LabelPrimitive.Root>,
	ComponentPropsWithoutRef<typeof LabelPrimitive.Root> & VariantProps<typeof labelVariants>
>(({
    className,
    ...props
  },
  ref,
): ReactElement => (
	<LabelPrimitive.Root
		ref={ref}
		className={combineNames(
      labelVariants(),
      className,
    )}
		{...props} />
));

/**
 * Label display name for debugging purposes.
 */
Label.displayName = LabelPrimitive.Root.displayName;

export { Label };
