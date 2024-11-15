import { SideNoticeMutationSchema } from '@/schemas/side-notice';
import { z } from 'zod';

export type SideNoticeMutationType = z.infer<typeof SideNoticeMutationSchema>;
