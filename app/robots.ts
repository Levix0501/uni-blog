import type { MetadataRoute } from 'next';

export default async function robots(): Promise<MetadataRoute.Robots> {
	return {
		rules: {
			userAgent: '*',
			disallow: '/admin/'
		}
	};
}
