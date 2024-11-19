import { getBasicInfoApi, SettingApi } from '@/apis/setting';
import Link from 'next/link';
import Logo from './logo';
import { ModeToggle } from './mode-toggle';

export interface HeaderBarProps {
	basicInfo: SettingApi.GetBasicInfoResult;
}

export const HeaderBar = async ({ basicInfo }: HeaderBarProps) => {
	return (
		<header className="sticky top-0 z-50 pl-6 pr-1 sm:px-6 h-16 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 dark:border-border">
			<nav className="w-full h-full flex justify-between items-center max-w-[1400px]">
				<Link href="/">
					<div className="flex items-center space-x-2">
						<Logo basicInfo={basicInfo} />
						<p className="font-semibold text-foreground">
							{basicInfo.siteName || 'Uni Blog'}
						</p>
					</div>
				</Link>

				<ModeToggle />
			</nav>
		</header>
	);
};
