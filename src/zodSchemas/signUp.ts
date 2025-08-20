import { z } from 'zod';

export const signUpSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, { message: 'Name should be atleast 1 character long.' })
    .max(100, { message: 'Name should be maximum 100 characters long.' }),
  email: z.email({ error: 'Please provide a valid email.' }),
  password: z
    .string()
    .regex(
      /^(?=.*[0-9])(?=.*[A-Z])(?=.*[a-z])(?=.*[:()@#4%&*\[\]!^])(?!.*\s).{8,}$/,
      {
        message:
          'Password must have atleast 1 number, 1 uppercase, 1 lowercase and 1 special character',
      },
    ),
});
