import GoogleAnalytics from '@/components/google-analytics';
import { NprogressBar } from '@/components/nprogress-bar';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '../styles/globals.css';
import { Toaster } from '@/components/ui/sonner';
import { getBasicInfoApi } from '@/apis/setting';
import { Providers } from './providers';
import BaiduAnalytics from '@/components/baidu-analytics';

const inter = Inter({ subsets: ['latin'] });

export async function generateMetadata(): Promise<Metadata> {
	const basicInfo = await getBasicInfoApi();

	return {
		title: basicInfo.siteName,
		description: basicInfo.description,
		keywords: basicInfo.keywords,
		icons: [{ url: basicInfo.logo || '/logo.svg' }]
	};
}

export default function RootLayout({
	children
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<head>
				<BaiduAnalytics />
			</head>
			<body className={inter.className}>
				<Providers>
					{children}
					<NprogressBar />
					<Toaster richColors />
				</Providers>
			</body>
			<GoogleAnalytics />
		</html>
	);
}
