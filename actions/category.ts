'use server';

import { db } from '@/lib/db';
import { CategoryMutationSchema } from '@/schemas/category';
import { CategoryMutationType } from '@/types/category';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import dayjs from 'dayjs';

export const getCategoryListAction = async ({ page = 1, size = 20 }) =>
	Promise.all([
		db.category.findMany({
			skip: (page - 1) * size,
			take: size,
			orderBy: { createTime: 'desc' }
		}),
		db.category.count()
	]);

export const getAllPublishedCategoriesAction = async () => {
	const total = await db.category.count();
	const result = await db.category.findMany({
		take: total,
		where: { status: 'published' }
	});
	return result;
};

export const createCategoryAction = async (values: CategoryMutationType) => {
	const validatedFields = CategoryMutationSchema.safeParse(values);

	if (!validatedFields.success) {
		return { error: '无效字段！' };
	}

	try {
		await db.category.create({
			data: {
				...validatedFields.data,

				createTime: dayjs().toISOString(),
				updateTime: dayjs().toISOString()
			}
		});
	} catch (error) {
		if (error instanceof PrismaClientKnownRequestError) {
			switch (error.code) {
				case 'P2002':
					return { error: '分类slug已存在！' };
				default:
					return { error: '发生了一些错误！' };
			}
		}
		throw error;
	}
};

export const deleteCategoryAction = async (id: string) => {
	await db.category.delete({ where: { id } });
};

export const editCategoryAction = async (
	values: CategoryMutationType,
	id: string
) => {
	const validatedFields = CategoryMutationSchema.safeParse(values);

	if (!validatedFields.success) {
		return { error: '无效字段！' };
	}

	try {
		await db.category.update({
			where: { id },
			data: validatedFields.data
		});
	} catch (error) {
		if (error instanceof PrismaClientKnownRequestError) {
			switch (error.code) {
				case 'P2002':
					return { error: '分类slug已存在！' };
				default:
					return { error: '发生了一些错误！' };
			}
		}
		throw error;
	}
};

export const getTotalPostsOfCategoryAction = async (slug: string) => {
	console.log('getTotalPostsOfCategoryAction');
	const result = await db.post.count({ where: { category: { slug } } });
	return result;
};
