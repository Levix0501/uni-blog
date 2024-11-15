import type { NextAuthConfig } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { LoginSchema } from '@/schemas/login';
import { loginApi } from '@/apis/auth';

export default {
	providers: [
		Credentials({
			authorize: async (credentials) => {
				const validatedFields = LoginSchema.safeParse(credentials);

				if (validatedFields.success) {
					const { password } = validatedFields.data;
					const user = await loginApi({
						password
					});

					if (!user) return null;

					return user;
				}

				return null;
			}
		})
	]
} satisfies NextAuthConfig;
