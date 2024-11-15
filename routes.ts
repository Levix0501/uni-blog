/**
 * An array of routes that are accessible to the public
 * These routes do not require authentication
 * @type {string[]}
 */
export const publicRoutes = ['/'];

/**
 * The default redirect path after loggin in
 * @type {string}
 */
export const DEFAULT_LOGIN_REDIRECT = '/admin';

export const LOGIN_ROUTE = '/admin/auth/login';

/**
 * An array of routes that are used for authentication
 * These routes will redirect logged in users to /admin
 * @type {string[]}
 */
export const authRoutes = [LOGIN_ROUTE];

/**
 * The prefix for API authentication routes
 * Routes that start with this prefix are used for API authentication puposes
 * @type {string}
 */
export const apiAuthPrefix = '/api/auth';
