import * as z from 'zod';

export const LoginSchema = z.object({
	password: z.string().min(1, {
		message: '请输入密码'
	})
});
