import dayjs from 'dayjs';
import { accessSync, unlinkSync, writeFileSync } from 'fs';
import imageSize from 'image-size';
import { join } from 'path';
import { checkOrCreate } from './check-folder';
import { encryptFileMD5 } from './crypto';
import { db } from './db';

const STATIC_FOLDER =
	process.env.NODE_ENV === 'production'
		? '/app/_uni' // 生产环境路径
		: join(process.cwd(), '.static'); // 开发环境路径

export const saveImage = async (file: File) => {
	const type = file.type.split('/');
	if (type.length !== 2 || type[0] !== 'image') {
		throw new Error('文件类型获取失败！');
	}

	const arrayBuffer = await file.arrayBuffer();
	const buffer = Buffer.from(arrayBuffer);
	const fileMd5 = encryptFileMD5(buffer);

	const result = await db.image.findUnique({ where: { sign: fileMd5 } });
	if (result) {
		return result;
	}

	const nameArr = file.name.split('.');
	const suffix = `${nameArr[nameArr.length - 1]}`;
	const metadata = imageSize(buffer);
	if (!metadata.width || !metadata.height) {
		throw new Error('图片尺寸获取失败！');
	}

	const fileName = `${fileMd5}.${suffix}`;

	checkOrCreate(STATIC_FOLDER);

	const path = join(STATIC_FOLDER, fileName);
	writeFileSync(path, buffer);

	const image = await db.image.create({
		data: {
			sign: fileMd5,
			suffix,
			url: fileName,
			storageType: 'local',
			width: metadata.width,
			height: metadata.height,
			createTime: dayjs().toISOString(),
			updateTime: dayjs().toISOString()
		}
	});

	return image;
};

export const deleteImage = async (id: string) => {
	const image = await db.image.findUnique({ where: { id } });
	if (!image) return;

	try {
		const path = join(STATIC_FOLDER, `${image.sign}.${image.suffix}`);
		accessSync(path);
		unlinkSync(path);
	} catch (error) {
		console.log(error);
	}

	await db.image.delete({ where: { id } });
};
