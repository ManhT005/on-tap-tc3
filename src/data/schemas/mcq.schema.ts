import { z } from 'zod';

export const MultipleChoiceOptionsSchema = z
  .array(z.string().trim().min(1))
  .length(4)
  .refine((options) => new Set(options).size === 4, 'Four distinct nonblank options are required');
