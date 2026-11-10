'use client';

import { Controller, FormProvider } from 'react-hook-form';
import type {
  ControllerProps,
  FieldPath,
  FieldValues,
  SubmitHandler,
  UseFormReturn,
} from 'react-hook-form';

// ─── Form ─────────────────────────────────────────────────────────────────────
type FormProps<TFieldValues extends FieldValues> = {
  form: UseFormReturn<TFieldValues>;
  onSubmit: SubmitHandler<TFieldValues>;
  className?: string;
  children: React.ReactNode;
}

// Note the comma after TFieldValues, it is a trick for .tsx files
export function Form<TFieldValues extends FieldValues>({
  form,
  onSubmit,
  className,
  children,
}: FormProps<TFieldValues>) {
  return (
    <FormProvider {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={className}
        noValidate
      >
        {children}
      </form>
    </FormProvider>
  );
}

// ─── FormField ────────────────────────────────────────────────────────────────
// Arrow syntax with generics tends to be more stable in TSX
export const FormField = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  ...props
}: ControllerProps<TFieldValues, TName>) => {
  return <Controller {...props} />;
};
