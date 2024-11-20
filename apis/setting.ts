import { db } from '@/lib/db';

export namespace SettingApi {}

export const getSiteSettingApi = async () => {
	try {
		const result = await db.siteSetting.findFirst({ include: { logo: true } });
		return result;
	} catch (error) {
		return null;
	}
};

export const getAnalyticsSettingApi = async () => {
	try {
		const result = await db.analyticsSetting.findFirst();
		return result;
	} catch (error) {
		return null;
	}
};
