import { UpsertPostSchema } from '@/schemas/post';
import { z } from 'zod';

export type UpsertPostType = z.infer<typeof UpsertPostSchema>;
