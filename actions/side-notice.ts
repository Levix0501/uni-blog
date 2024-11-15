'use server';

import { db } from '@/lib/db';
import { SideNoticeMutationType } from '@/types/side-notice';
import dayjs from 'dayjs';

export const getSideNoticeListAction = async ({ page = 1, size = 20 }) =>
	Promise.all([
		db.sideNotice.findMany({
			skip: (page - 1) * size,
			take: size,
			orderBy: { createTime: 'desc' },
			include: { image: true }
		}),
		db.sideNotice.count()
	]);

export const getAllPublishedSideNoticeListAction = async () => {
	const total = await db.category.count();
	const result = await db.category.findMany({
		take: total,
		where: { status: 'published' }
	});
	return result;
};

export const createSideNoticeAction = async (
	values: SideNoticeMutationType
) => {
	try {
		await db.sideNotice.create({
			data: {
				...values,
				createTime: dayjs().toISOString(),
				updateTime: dayjs().toISOString()
			}
		});
		return { success: '创建成功！' };
	} catch (error) {
		console.log(error);
		return { error: '创建失败！' };
	}
};

export const deleteSideNoticeAction = async (id: string) => {
	await db.category.delete({ where: { id } });
};

export const editSideNoticeAction = async (
	values: SideNoticeMutationType,
	id: string
) => {
	try {
		await db.sideNotice.update({
			where: { id },
			data: values
		});
		return { success: '修改成功！' };
	} catch (error) {
		return { error: '修改失败！' };
	}
};
