import GoogleAnalytics from '@/components/google-analytics';
import { NprogressBar } from '@/components/nprogress-bar';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '../styles/globals.css';
import { Toaster } from '@/components/ui/sonner';
import { getSiteSettingApi } from '@/apis/setting';
import { Providers } from './providers';
import BaiduAnalytics from '@/components/baidu-analytics';

const inter = Inter({ subsets: ['latin'] });

export async function generateMetadata(): Promise<Metadata> {
	const siteSetting = await getSiteSettingApi();

	return {
		title: siteSetting?.siteName,
		description: siteSetting?.description,
		keywords: siteSetting?.keywords,
		icons: [{ url: siteSetting?.logo?.url || '/logo.svg' }]
	};
}

export default async function RootLayout({
	children
}: Readonly<{
	children: React.ReactNode;
}>) {
	const siteSetting = await getSiteSettingApi();

	return (
		<html lang="en">
			<head>
				<BaiduAnalytics />
			</head>
			<body className={inter.className}>
				<Providers siteSetting={siteSetting}>
					{children}
					<NprogressBar />
					<Toaster richColors />
				</Providers>
			</body>
			<GoogleAnalytics />
		</html>
	);
}
