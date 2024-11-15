// import analyze from '@next/bundle-analyzer';

// const withBundleAnalyzer = analyze({
// 	enabled: process.env.ANALYZE === 'true'
// });

/** @type {import('next').NextConfig} */
const nextConfig = {
	output: 'standalone',
	images: {
		remotePatterns: [
			{
				hostname: 'localhost'
			},
			{
				hostname: 'caddy'
			},
			{
				hostname: '**.myqcloud.com'
			}
		]
	}
};

export default nextConfig;
