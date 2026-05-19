import { z } from 'zod';

export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, 'errors.required_field')
    .email('errors.invalid_email'),
});

export type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;
