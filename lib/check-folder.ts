import * as fs from 'fs';

export const checkOrCreate = (path: string) => {
	try {
		fs.readdirSync(path);
	} catch (err) {
		console.log(`${path}不存在，创建。`);
		fs.mkdirSync(path, { recursive: true });
	}
};
