import { CategoryMutationSchema } from '@/schemas/category';
import { z } from 'zod';

export type CategoryMutationType = z.infer<typeof CategoryMutationSchema>;
