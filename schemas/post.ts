import { z } from 'zod';

export const UpsertPostSchema = z.object({
	id: z.number().optional(),
	categoryId: z.string().min(1, { message: '请选择分类！' }),
	title: z.string().min(1, { message: '请输入标题！' }),
	abstract: z.string(),
	content: z.string().min(1, { message: '内容不可为空！' }),
	imageId: z.string().optional(),
	slug: z.string().optional(),
	keywords: z.string().optional()
});
