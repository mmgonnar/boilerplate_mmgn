import { z } from 'zod';

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'errors.required_field')
    .email('errors.invalid_email'),
  password: z.string().min(1, 'errors.required_field'),
});

export type LoginFormValues = z.infer<typeof loginSchema>;
