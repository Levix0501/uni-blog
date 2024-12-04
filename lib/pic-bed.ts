import 'server-only';
import imageSize from 'image-size';
import { Image } from '@prisma/client';
import { encryptFileMD5 } from './crypto';
import { db } from './db';
import { deleteFile, getFileUrl, saveFile } from './storage';
import { ExtendedImageType } from '@/types/image';

export const saveImage = async (file: File): Promise<ExtendedImageType> => {
	const arrayBuffer = await file.arrayBuffer();
	const buffer = Buffer.from(arrayBuffer);
	const fileMd5 = encryptFileMD5(buffer);

	const result = await db.image.findUnique({ where: { sign: fileMd5 } });
	if (result) {
		return getImageUrl(result);
	}

	const nameArr = file.name.split('.');
	const suffix = `${nameArr[nameArr.length - 1]}`;
	const metadata = imageSize(buffer);
	if (!metadata.width || !metadata.height) {
		throw new Error('图片尺寸获取失败！');
	}

	const { url, storageType } = await saveFile(file, fileMd5);

	const image = await db.image.create({
		data: {
			sign: fileMd5,
			suffix,
			url,
			storageType,
			width: metadata.width,
			height: metadata.height,
			createTime: new Date(),
			updateTime: new Date()
		}
	});

	return getImageUrl(image);
};

export const deleteImage = async (id: string) => {
	const image = await db.image.findUnique({ where: { id } });
	if (!image) return;

	await deleteFile(image.url);

	await db.image.delete({ where: { id } });
};

export const getImageUrl = (image: Image): ExtendedImageType => {
	if (image.url.startsWith('http')) {
		return { ...image, imgUrl: image.url, nextImageUrl: image.url };
	}

	const url = getFileUrl(image.url);
	if (image.storageType === 'local') {
		return {
			...image,
			imgUrl: url,
			nextImageUrl: image.suffix === 'svg' ? url : `http://caddy${url}`
		};
	}

	return { ...image, imgUrl: url, nextImageUrl: url };
};
