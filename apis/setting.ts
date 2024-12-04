import { db } from '@/lib/db';
import { getImageUrl } from '@/lib/pic-bed';

export namespace SettingApi {}

export const getSiteSettingApi = async () => {
	try {
		const result = await db.siteSetting.findFirst({ include: { logo: true } });

		return { ...result, logo: result?.logo ? getImageUrl(result?.logo) : null };
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
