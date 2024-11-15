import { SideNoticeOrientation, SideNoticeStatus } from '@prisma/client';
import { z } from 'zod';

export const SideNoticeMutationSchema = z.object({
	id: z.string().optional(),
	name: z.string(),
	desc: z.string(),
	imageId: z.string().optional(),
	order: z.number().optional(),
	status: z.enum<SideNoticeStatus, [SideNoticeStatus, ...SideNoticeStatus[]]>([
		'draft',
		'published'
	]),
	orientation: z.enum<
		SideNoticeOrientation,
		[SideNoticeOrientation, ...SideNoticeOrientation[]]
	>(['vertical', 'horizontal'])
});
