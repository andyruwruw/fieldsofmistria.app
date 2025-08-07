// Packages

import {
  createContext,
  forwardRef,
  useContext,
  type ComponentPropsWithoutRef,
  type ComponentRef,
  type ReactElement,
} from 'react';
import * as ToggleGroupPrimitive from '@radix-ui/react-toggle-group';
import { type VariantProps } from 'class-variance-authority';

// Local Imports
import { toggleVariants } from './toggle/variants';
import { combineNames } from '../../lib/utils';

/**
 * ToggleGroup component that provides a group of toggle buttons.
 */
const ToggleGroupContext = createContext<
	VariantProps<typeof toggleVariants>
>({
	size: 'default',
	variant: 'default',
});

const ToggleGroup = forwardRef<
	ComponentRef<typeof ToggleGroupPrimitive.Root>,
	ComponentPropsWithoutRef<typeof ToggleGroupPrimitive.Root> &
		VariantProps<typeof toggleVariants>
>(({
    className,
    variant,
    size,
    children,
    ...props
  },
  ref,
): ReactElement => (
	<ToggleGroupPrimitive.Root
		ref={ref}
		className={combineNames(
      'flex items-center justify-center gap-1',
      className,
    )}
		{...props}>
		<ToggleGroupContext.Provider value={{
      variant,
      size,
    }}>
			{children}
		</ToggleGroupContext.Provider>
	</ToggleGroupPrimitive.Root>
));

/**
 * ToggleGroup display name for debugging purposes.
 */
ToggleGroup.displayName = ToggleGroupPrimitive.Root.displayName;

/**
 * ToggleGroupItem component that represents a single item in the toggle group.
 */
const ToggleGroupItem = forwardRef<
	ComponentRef<typeof ToggleGroupPrimitive.Item>,
	ComponentPropsWithoutRef<typeof ToggleGroupPrimitive.Item> &
		VariantProps<typeof toggleVariants>
>(({
    className,
    children,
    variant,
    size,
    ...props
  },
  ref,
): ReactElement => {
	const context = useContext(ToggleGroupContext);

	return (
		<ToggleGroupPrimitive.Item
			ref={ref}
			className={combineNames(
				toggleVariants({
					variant: context.variant || variant,
					size: context.size || size,
				}),
				className,
			)}
			{...props}>
			{children}
		</ToggleGroupPrimitive.Item>
	);
});

/**
 * ToggleGroupItem display name for debugging purposes.
 */
ToggleGroupItem.displayName = ToggleGroupPrimitive.Item.displayName;

export {
  ToggleGroup,
  ToggleGroupItem,
};
