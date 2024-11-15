import { BasicInfoSchema } from '@/schemas/setting';
import { z } from 'zod';

export type BasicInfoType = z.infer<typeof BasicInfoSchema>;
