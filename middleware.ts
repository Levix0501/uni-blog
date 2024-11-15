import NextAuth from 'next-auth';

import authConfig from '@/auth.config';
import {
	apiAuthPrefix,
	authRoutes,
	DEFAULT_LOGIN_REDIRECT,
	LOGIN_ROUTE,
	publicRoutes
} from '@/routes';

export const config = {
	matcher: ['/(admin|auth|api)(.*)']
};

const { auth } = NextAuth(authConfig);

export default auth((req) => {
	const { nextUrl, auth } = req;
	const isLoggedIn = !!auth;

	const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);
	// const isPublicRoute = publicRoutes.includes(nextUrl.pathname);
	const isAuthRoute = authRoutes.includes(nextUrl.pathname);

	if (isApiAuthRoute) {
		return;
	}

	if (isAuthRoute) {
		if (isLoggedIn) {
			return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
		}
		return;
	}

	if (!isLoggedIn) {
		let callbackUrl = nextUrl.pathname;
		if (nextUrl.search) {
			callbackUrl += nextUrl.search;
		}

		const encodedCallbackUrl = encodeURIComponent(callbackUrl);

		return Response.redirect(
			new URL(`${LOGIN_ROUTE}?callbackUrl=${encodedCallbackUrl}`, nextUrl)
		);
	}
});
