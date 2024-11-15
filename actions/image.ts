'use server';

import { deleteImage } from '@/lib/pic-bed';

export const deleteImageAction = async (id: string) => {
	try {
		await deleteImage(id);
		return { success: '删除成功！' };
	} catch (error) {
		console.log(error);
		return { error: '删除失败！' };
	}
};
