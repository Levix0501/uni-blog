'use client';

import Link from 'next/link';
import Logo from './logo';
import { ModeToggle } from './mode-toggle';
import { useSettings } from '@/hooks/use-settings';

export const HeaderBar = () => {
	const { siteSetting } = useSettings();
	return (
		<header className="sticky top-0 z-50 px-4 sm:px-6 h-16 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 dark:border-border">
			<nav className="w-full h-full flex justify-between items-center">
				<Link href="/">
					<div className="flex items-center space-x-2">
						<Logo />
						<p className="font-semibold text-foreground">
							{siteSetting?.siteName || 'Uni Blog'}
						</p>
					</div>
				</Link>

				<ModeToggle />
			</nav>
		</header>
	);
};
