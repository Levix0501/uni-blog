'use server';

import { deleteImage, saveImage } from '@/lib/pic-bed';

export const deleteImageAction = async (id: string) => {
	try {
		await deleteImage(id);
		return { success: '删除成功！' };
	} catch (error) {
		console.log(error);
		return { error: '删除失败！' };
	}
};

export const uploadImageAction = async (formData: FormData) => {
	try {
		const file = formData.get('image') as File;
		const result = await saveImage(file);
		return { success: result };
	} catch (error) {
		return { error: '上传失败！' };
	}
};
