import { join } from 'path';
import { IStorage } from '.';
import { checkOrCreate } from '../check-folder';
import { accessSync, unlinkSync, writeFileSync } from 'fs';

const STORAGE_FOLDER =
	process.env.NODE_ENV === 'production'
		? '/app/_uni'
		: join(process.cwd(), '.static');

const storage: IStorage = {
	async save({ file, path: _path }) {
		checkOrCreate(STORAGE_FOLDER);

		const path = join(STORAGE_FOLDER, _path);
		const arrayBuffer = await file.arrayBuffer();

		writeFileSync(path, Buffer.from(arrayBuffer));

		return { url: _path, storageType: 'local' };
	},
	async delete(_path) {
		try {
			const path = join(STORAGE_FOLDER, _path);
			accessSync(path);
			unlinkSync(path);
		} catch (error) {}
	},
	getUrl(path) {
		return `/_uni/${path}`;
	}
};

export default storage;
