// Packages
import {
  forwardRef,
  useId,
  type ComponentPropsWithoutRef,
  type ComponentRef,
  type HTMLAttributes,
  type ReactElement,
} from 'react';
import {
	Controller,
	FormProvider,
  type ControllerProps,
  type FieldPath,
  type FieldValues,
} from 'react-hook-form';
import { Slot } from '@radix-ui/react-slot';
import * as LabelPrimitive from '@radix-ui/react-label';

// Local Imports
import {
  FormFieldContext,
  FormItemContext,
  useFormField,
} from './use-form-field';
import { combineNames } from '../../../lib/utils';
import { Label } from '../label';

/**
 * Form component that provides a context for form handling.
 */
const Form = FormProvider;

/**
 * FormField component that wraps a form field and provides context for its state.
 * It uses the Controller from react-hook-form to manage the field's value and validation.
 */
const FormField = <
	TFieldValues extends FieldValues = FieldValues,
	TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({ ...props }: ControllerProps<TFieldValues, TName>) => (
  <FormFieldContext.Provider value={{ name: props.name }}>
    <Controller {...props} />
  </FormFieldContext.Provider>
);

/**
 * FormItem component that provides a wrapper for form fields.
 * It uses the FormItemContext to provide an ID for the form item.
 */
const FormItem = forwardRef<
	HTMLDivElement,
	HTMLAttributes<HTMLDivElement>
>(({
    className,
    ...props
  },
  ref,
): ReactElement => {
	const id = useId();

	return (
		<FormItemContext.Provider value={{ id }}>
			<div
        ref={ref}
        className={combineNames(
          'space-y-2',
          className,
        )}
        {...props} />
		</FormItemContext.Provider>
	);
});

/**
 * FormItem display name for debugging purposes.
 */
FormItem.displayName = 'FormItem';

/**
 * FormLabel component that provides a label for the form field.
 * It uses the LabelPrimitive from Radix UI to create a label element.
 */
const FormLabel = forwardRef<
	ComponentRef<typeof LabelPrimitive.Root>,
	ComponentPropsWithoutRef<typeof LabelPrimitive.Root>
>(({
    className,
    ...props
  },
  ref,
): ReactElement => {
	const {
    error,
    formItemId,
  } = useFormField();

	return (
		<Label
			ref={ref}
			className={combineNames(
        error && 'text-red-500 dark:text-red-900',
        className,
      )}
			htmlFor={formItemId as string}
			{...props} />
	);
});

/**
 * FormLabel display name for debugging purposes.
 */
FormLabel.displayName = 'FormLabel';

/**
 * FormControl component that provides a wrapper for form controls.
 * It uses the Slot component from Radix UI to create a slot for the form control.
 */
const FormControl = forwardRef<
	ComponentRef<typeof Slot>,
	ComponentPropsWithoutRef<typeof Slot>
>((
  { ...props },
  ref,
): ReactElement => {
	const {
    error,
    formItemId,
    formDescriptionId,
    formMessageId,
  } = useFormField();

	return (
		<Slot
			ref={ref}
			id={formItemId as string}
			aria-describedby={
				!error
					? `${formDescriptionId}`
					: `${formDescriptionId} ${formMessageId}`
			}
			aria-invalid={!!error}
			{...props} />
	);
});

/**
 * FormControl display name for debugging purposes.
 */
FormControl.displayName = 'FormControl';

/**
 * FormDescription component that provides a description for the form field.
 */
const FormDescription = forwardRef<
	HTMLParagraphElement,
	HTMLAttributes<HTMLParagraphElement>
>(({
    className,
    ...props
  },
  ref,
): ReactElement => {
	const { formDescriptionId } = useFormField();

	return (
		<p
			ref={ref}
			id={formDescriptionId as string}
			className={combineNames(
				'text-[0.8rem] text-neutral-500 dark:text-neutral-400',
				className,
			)}
			{...props} />
	);
});

/**
 * FormDescription display name for debugging purposes.
 */
FormDescription.displayName = 'FormDescription';

/**
 * FormMessage component that provides an error message for the form field.
 * It is typically used to display validation errors or other messages related to the form field.
 */
const FormMessage = forwardRef<
	HTMLParagraphElement,
	HTMLAttributes<HTMLParagraphElement>
>(({
    className,
    children,
    ...props
  },
  ref,
): ReactElement | null => {
	const {
    error,
    formMessageId,
  } = useFormField();
	const body = error ? String((error as unknown as Record<string, string>)?.message || '') : children;

	if (!body) {
		return null;
	}

	return (
		<p
			ref={ref}
			id={formMessageId as string}
			className={combineNames(
				'text-[0.8rem] font-medium text-red-500 dark:text-red-900',
				className,
			)}
			{...props}>
			{body}
		</p>
	);
});

/**
 * FormMessage display name for debugging purposes.
 */
FormMessage.displayName = 'FormMessage';

export {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
};
