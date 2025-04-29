import { z } from 'zod';

export const SearchLeadSchema = z.object({
  keyword: z.string().min(1, { message: 'Business type is required' }),
  city: z.string().min(1, { message: 'City is required' }),
  provinceOrState: z.string().min(1, {
    message: 'Province/State is required',
  }),
  country: z.string().min(1, { message: 'Country is required' }),
  withWebsites: z.boolean().default(false).optional(),
});

export type SearchLeadValues = z.infer<typeof SearchLeadSchema>;

export const LoginSchema = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
  password: z.string().min(8, { message: 'Password must be at least 8 characters' }),
})

export type LoginValues = z.infer<typeof LoginSchema>;

export const SignUpSchema = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
  password: z.string().min(8, { message: 'Password must be at least 8 characters' }),
  confirmPassword: z.string().min(8, { message: 'Confirm password is required' }),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
})

export type SignUpValues = z.infer<typeof SignUpSchema>;