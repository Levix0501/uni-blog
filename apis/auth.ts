import { db } from '@/lib/db';
import { uniConfig } from '@/uni.config';

export namespace AuthApi {
	export interface LoginParams {
		password: string;
	}
}

export const loginApi = async ({
	password
}: AuthApi.LoginParams): Promise<{} | null> => {
	try {
		const adminSetting = await db.adminSetting.findFirst();
		if (adminSetting) {
			return adminSetting.password === password ? {} : null;
		}
		return uniConfig.defaultPassword === password ? {} : null;
	} catch (error) {
		return null;
	}
};
