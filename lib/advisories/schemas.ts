import { z } from 'zod';

export const createAdvisorySchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, 'Title is required.')
    .max(120, 'Title must be 120 characters or fewer.'),
  message: z
    .string()
    .trim()
    .min(1, 'Message is required.')
    .max(2000, 'Message must be 2000 characters or fewer.'),
});
