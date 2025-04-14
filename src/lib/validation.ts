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
