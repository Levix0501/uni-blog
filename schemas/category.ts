import { PostStatus } from '@prisma/client';
import { z } from 'zod';

export const CategoryMutationSchema = z.object({
	id: z.string().optional(),
	slug: z.string().min(1, { message: '请输入分类 slug' }),
	name: z.string().min(1, { message: '请输入分类名称' }),
	order: z.number({ message: '请输入排序' }),
	status: z.enum<PostStatus, [PostStatus, ...PostStatus[]]>([
		'draft',
		'published'
	])
});
