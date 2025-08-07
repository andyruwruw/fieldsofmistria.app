// Packges
import {
  forwardRef,
  type ComponentPropsWithoutRef,
  type ComponentRef,
  type ReactElement,
} from 'react';
import { type VariantProps } from 'class-variance-authority';
import * as TogglePrimitive from '@radix-ui/react-toggle';

// Local Imports
import { toggleVariants } from './variants';
import { combineNames } from '../../../lib/utils';

/**
 * Toggle component that provides a switch-like UI element.
 * It can be used to toggle between two states, such as on/off or active/inactive.
 */
export const Toggle = forwardRef<
  ComponentRef<typeof TogglePrimitive.Root>,
  ComponentPropsWithoutRef<typeof TogglePrimitive.Root> &
    VariantProps<typeof toggleVariants>
>(({
    className,
    variant,
    size,
    ...props
  },
  ref,
): ReactElement => (
  <TogglePrimitive.Root
    ref={ref}
    className={combineNames(toggleVariants({
      variant,
      size,
      className,
    }))}
    {...props} />
));
