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
				hostname: '**.myqcloud.com'
			},
			{
				hostname: '**.supabase.co'
			},
			{
				hostname: 'localhost'
			},
			{
				hostname: 'caddy'
			}
		]
	},
	experimental: {
		serverActions: {
			bodySizeLimit: '2mb'
		}
	}
};

export default nextConfig;
