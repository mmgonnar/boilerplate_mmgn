import { z } from 'zod';

export const registerSchema = z
  .object({
    name: z.string().min(1, 'errors.required_field'),
    email: z
      .string()
      .min(1, 'errors.required_field')
      .email('errors.invalid_email'),
    password: z.string().min(8, 'errors.password_too_short'),
    confirmPassword: z.string().min(1, 'errors.required_field'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'errors.passwords_dont_match',
    path: ['confirmPassword'],
  });

export type RegisterFormValues = z.infer<typeof registerSchema>;
