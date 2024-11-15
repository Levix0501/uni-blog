import { CONSTANT_SETTING_KEY } from '@/constants/setting';
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
		const pwdConfig = await db.setting.findUnique({
			where: { key: CONSTANT_SETTING_KEY.password }
		});
		if (pwdConfig) {
			return pwdConfig.value === password ? {} : null;
		}
		return uniConfig.defaultPassword === password ? {} : null;
	} catch (error) {
		return null;
	}
};
