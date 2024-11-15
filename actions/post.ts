'use server';

import { db } from '@/lib/db';
import { UpsertPostType } from '@/types/post';
import dayjs from 'dayjs';

export const fetchPostsAction = async ({ page = 1, size = 20 }) =>
	Promise.all([
		db.post.findMany({
			skip: (page - 1) * size,
			take: size,
			orderBy: { createTime: 'desc' },
			include: { cover: true }
		}),
		db.post.count()
	]);

export const deletePostAction = async (id: number) => {
	await db.post.delete({ where: { id } });
};

export const upsertPostAction = async ({
	abstract,
	categoryId,
	content,
	title,
	imageId,
	keywords,
	slug,
	id
}: UpsertPostType) => {
	const result = id && (await db.post.findUnique({ where: { id } }));

	if (result) {
		await db.post.update({
			where: { id },
			data: {
				abstract,
				categoryId,
				content,
				title,
				imageId,
				keywords,
				slug,
				updateTime: dayjs().toISOString()
			}
		});
	} else {
		await db.post.create({
			data: {
				category: { connect: { id: categoryId } },
				cover: { connect: { id: imageId } },
				createTime: dayjs().toISOString(),
				updateTime: dayjs().toISOString(),
				status: 'published',
				abstract,
				content,
				title,
				keywords,
				slug
			}
		});
	}
};
