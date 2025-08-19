import { z } from 'zod';

export const signInSchema = z.object({
  email: z.email({ error: 'Please provide valid email.' }),
  password: z
    .string()
    .trim()
    .min(8, { message: 'Password should be atleast 8 characters long.' }),
});

export type signInDto = z.infer<typeof signInSchema>;
