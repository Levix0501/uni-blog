import { CONSTANT_SETTING_KEY } from '@/constants/setting';
import { db } from '@/lib/db';
import { AnalyticsSettingSchema, BasicInfoSchema } from '@/schemas/setting';
import { z } from 'zod';

export namespace SettingApi {
	export type GetBasicInfoResult = z.infer<typeof BasicInfoSchema>;

	export type GetAnalyticsSettingResult = z.infer<
		typeof AnalyticsSettingSchema
	>;
}

export const getBasicInfoApi = async () => {
	try {
		const result = await db.setting.findUnique({
			where: { key: CONSTANT_SETTING_KEY.basicInfo }
		});
		if (result?.value) {
			return JSON.parse(result?.value) as SettingApi.GetBasicInfoResult;
		}
		return {};
	} catch (error) {
		return {};
	}
};

export const getAnalyticsSettingApi = async () => {
	try {
		const result = await db.setting.findUnique({
			where: { key: CONSTANT_SETTING_KEY.analytics }
		});
		if (result?.value) {
			return JSON.parse(result?.value) as SettingApi.GetAnalyticsSettingResult;
		}
		return {};
	} catch (error) {
		return {};
	}
};
