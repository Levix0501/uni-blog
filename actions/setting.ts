'use server';

import { CONSTANT_SETTING_KEY } from '@/constants/setting';
import { db } from '@/lib/db';
import { AnalyticsSettingSchema, BasicInfoSchema } from '@/schemas/setting';
import { ResetAdminPasswordSchema } from '@/schemas/setting';
import { z } from 'zod';
import { revalidateAllAction } from './revalidate';
import { uniConfig } from '@/uni.config';

export const updateBasicInfoAction = async (
	values: z.infer<typeof BasicInfoSchema>
) => {
	await db.setting.upsert({
		create: {
			key: CONSTANT_SETTING_KEY.basicInfo,
			value: JSON.stringify(values),
			createTime: new Date(),
			updateTime: new Date()
		},
		update: {
			value: JSON.stringify(values),
			updateTime: new Date()
		},
		where: {
			key: CONSTANT_SETTING_KEY.basicInfo
		}
	});
	revalidateAllAction();
	return { success: '修改成功！' };
};

export const updateAnalyticsSettingAction = async (
	values: z.infer<typeof AnalyticsSettingSchema>
) => {
	await db.setting.upsert({
		create: {
			key: CONSTANT_SETTING_KEY.analytics,
			value: JSON.stringify(values),
			createTime: new Date(),
			updateTime: new Date()
		},
		update: {
			value: JSON.stringify(values),
			updateTime: new Date()
		},
		where: {
			key: CONSTANT_SETTING_KEY.analytics
		}
	});
	revalidateAllAction();
	return { success: '修改成功！' };
};

export const resetAdminPasswordAction = async (
	values: z.infer<typeof ResetAdminPasswordSchema>
) => {
	const validatedFields = ResetAdminPasswordSchema.safeParse(values);

	if (!validatedFields.success) {
		return { error: '无效字段！' };
	}

	const { oldPassword, newPassword } = validatedFields.data;

	try {
		const pwdSetting = await db.setting.findUnique({
			where: { key: CONSTANT_SETTING_KEY.password }
		});
		if (
			(!pwdSetting && oldPassword !== uniConfig.defaultPassword) ||
			(pwdSetting && oldPassword !== pwdSetting.value)
		) {
			return { error: '原密码错误！' };
		}

		if (pwdSetting) {
			await db.setting.update({
				where: { key: CONSTANT_SETTING_KEY.password },
				data: {
					value: newPassword,
					updateTime: new Date()
				}
			});
		} else {
			await db.setting.create({
				data: {
					key: CONSTANT_SETTING_KEY.password,
					value: newPassword,
					createTime: new Date(),
					updateTime: new Date()
				}
			});
		}
		return { success: '修改成功！' };
	} catch (error) {
		throw error;
	}
};
