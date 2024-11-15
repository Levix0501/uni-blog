import * as z from 'zod';

export const BasicInfoSchema = z.object({
	siteName: z.string().optional(),
	logo: z.string().optional(),
	description: z.string().optional(),
	keywords: z.string().optional(),
	year: z.string().optional(),
	icp: z.string().optional()
});

export const AnalyticsSettingSchema = z.object({
	gaId: z.string().optional(),
	bdtj: z.string().optional()
});

export const ResetAdminPasswordSchema = z.object({
	oldPassword: z.string().min(1, {
		message: '请输入原密码'
	}),
	newPassword: z.string().min(1, {
		message: '请输入新密码'
	})
});
