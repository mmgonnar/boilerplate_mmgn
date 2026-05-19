import { z } from 'zod';

export const resetPasswordSchema = z
  .object({
    password: z.string().min(8, 'errors.password_too_short'),
    confirmPassword: z.string().min(1, 'errors.required_field'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'errors.passwords_dont_match',
    path: ['confirmPassword'],
  });

export type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;
