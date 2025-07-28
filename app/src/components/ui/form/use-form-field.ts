// Packages
import {
  useFormContext,
  type FieldError,
  type FieldPath,
  type FieldValues,
} from 'react-hook-form';
import {
  createContext,
  useContext,
} from 'react';

/**
 * FormFieldContextValue type that defines the context value for FormField.
 */
export type FormFieldContextValue<
	TFieldValues extends FieldValues = FieldValues,
	TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = {
  /**
   * The name of the field in the form.
   */
	name: TName;
};

/**
 * FormField component that wraps a form field and provides context for its state.
 * It uses the Controller from react-hook-form to manage the field's value and validation.
 */
export const FormFieldContext = createContext<FormFieldContextValue>(
	{} as FormFieldContextValue,
);

/**
 * FormItemContextValue type that defines the context value for FormItem.
 */
export type FormItemContextValue = {
  id: string;
};

/**
 * FormItem component that provides a wrapper for form fields.
 * It uses the FormItemContext to provide an ID for the form item.
 */
export const FormItemContext = createContext<FormItemContextValue>(
  {} as FormItemContextValue,
);

/**
 * useFormField hook that provides access to the field's state and context.
 *
 * @returns The useFormField hook provides access to the field's state and context.
 */
export const useFormField = (): Record<string, (string | boolean | FieldError)> => {
  const fieldContext = useContext(FormFieldContext);
  const itemContext = useContext(FormItemContext);
  const {
    getFieldState,
    formState,
  } = useFormContext();

  const fieldState = getFieldState(
    fieldContext.name,
    formState,
  );

  if (!fieldContext) {
    throw new Error('useFormField should be used within <FormField>');
  }

  const { id } = itemContext;

  return {
    id,
    name: fieldContext.name,
    formItemId: `${id}-form-item`,
    formDescriptionId: `${id}-form-item-description`,
    formMessageId: `${id}-form-item-message`,
    ...fieldState,
  };
};