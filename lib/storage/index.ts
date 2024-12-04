import { Image } from '@prisma/client';
import fs from './fs';
import supabase from './supabase';

export interface IStorage {
	save(input: {
		file: File;
		path: string;
	}): Promise<{ url: string; storageType: Image['storageType'] }>;
	delete(path: string): Promise<void>;
	getUrl(path: string): string;
}

const storage = process.env.SUPABASE_URL ? supabase : fs;

export const saveFile = async (file: File, fileMd5: string) => {
	const nameArr = file.name.split('.');
	const suffix = `${nameArr[nameArr.length - 1]}`;
	const fileName = `${fileMd5}.${suffix}`;

	return storage.save({ file, path: fileName });
};

export const deleteFile = async (path: string) => storage.delete(path);

export const getFileUrl = (path: string) => storage.getUrl(path);
