import * as crypto from 'crypto';

export function encryptFileMD5(buffer: Buffer) {
	const md5 = crypto.createHash('md5');
	return md5.update(buffer).digest('hex');
}
