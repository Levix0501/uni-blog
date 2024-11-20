'use server';

import { db } from '@/lib/db';
import { AnalyticsSettingSchema, SiteSettingSchema } from '@/schemas/setting';
import { ResetAdminPasswordSchema } from '@/schemas/setting';
import { z } from 'zod';
import { revalidateAllAction } from './revalidate';
import { uniConfig } from '@/uni.config';

export const updateSiteSettingAction = async (
	values: z.infer<typeof SiteSettingSchema>
) => {
	await db.siteSetting.upsert({
		create: {
			...values,
			logoId: values.logoId || undefined
		},
		update: {
			...values,
			logoId: values.logoId || undefined
		},
		where: {
			id: 1
		}
	});
	revalidateAllAction();
	return { success: '修改成功！' };
};

export const updateAnalyticsSettingAction = async (
	values: z.infer<typeof AnalyticsSettingSchema>
) => {
	await db.analyticsSetting.upsert({
		create: {
			...values
		},
		update: {
			...values
		},
		where: {
			id: 1
		}
	});
	revalidateAllAction();
	return { success: '修改成功！' };
};

export const updateAdminPasswordAction = async (
	values: z.infer<typeof ResetAdminPasswordSchema>
) => {
	const validatedFields = ResetAdminPasswordSchema.safeParse(values);

	if (!validatedFields.success) {
		return { error: '无效字段！' };
	}

	const { oldPassword, newPassword } = validatedFields.data;

	try {
		const adminSetting = await db.adminSetting.findFirst();
		if (
			(!adminSetting && oldPassword !== uniConfig.defaultPassword) ||
			(adminSetting && oldPassword !== adminSetting.password)
		) {
			return { error: '原密码错误！' };
		}

		if (adminSetting) {
			await db.adminSetting.update({
				where: { id: 1 },
				data: {
					password: newPassword
				}
			});
		} else {
			await db.adminSetting.create({
				data: {
					password: newPassword
				}
			});
		}
		return { success: '修改成功！' };
	} catch (error) {
		throw error;
	}
};
