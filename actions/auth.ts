'use server';

import { AuthError } from 'next-auth';
import { z } from 'zod';

import { signIn, signOut } from '@/auth';
import { DEFAULT_LOGIN_REDIRECT, LOGIN_ROUTE } from '@/routes';
import { LoginSchema } from '@/schemas/login';

export const loginAction = async (
	values: z.infer<typeof LoginSchema>,
	callbackUrl?: string | null
) => {
	const validatedFields = LoginSchema.safeParse(values);

	if (!validatedFields.success) {
		return { error: '无效字段！' };
	}

	const { password } = validatedFields.data;

	try {
		await signIn('credentials', {
			password,
			redirectTo: callbackUrl || DEFAULT_LOGIN_REDIRECT
		});
	} catch (error) {
		if (error instanceof AuthError) {
			switch (error.type) {
				case 'CredentialsSignin':
					return { error: '密码错误！' };
				default:
					return { error: '发生了一些错误！' };
			}
		}

		throw error;
	}
};

export const logOutAction = async () => {
	await signOut({ redirectTo: LOGIN_ROUTE });
};
