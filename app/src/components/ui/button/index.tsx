// Packages
import {
  forwardRef,
  type ReactElement,
} from 'react';
import {
  type VariantProps,
} from 'class-variance-authority';
import { Slot } from '@radix-ui/react-slot';

// Local Imports
import { combineNames } from '../../../lib/utils';
import ButtonVariants from './variants';

/**
 * Props for the Button component.
 */
export interface ButtonProps extends
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  VariantProps<typeof ButtonVariants> {
  /**
   * If true, the button will be rendered as a Slot component.
   * This allows for more flexible usage, such as wrapping other components.
   */
  asChild?: boolean;
}

/**
 * Button component that renders a button with various styles and sizes.
 * It can be used for actions like submitting forms, navigating, etc.
 * 
 * @param {ButtonProps} props - The properties for the button component.
 * @returns {ReactElement} The rendered button component.
 */
const Button = forwardRef<HTMLButtonElement, ButtonProps>(({
    className,
    variant,
    size,
    asChild = false,
    ...props
  },
  ref,
): ReactElement => {
    const Comp = asChild ? Slot : 'button';

    return (
      <Comp
        className={combineNames(ButtonVariants({
          variant,
          size,
          className,
        }))}
        ref={ref}
        {...props} />
    );
  },
);

/**
 * Button display name for debugging purposes.
 */
Button.displayName = 'Button';

export {
  Button,
  ButtonVariants,
};
