'use client';

import { ThemeProvider as NextThemesProvider } from 'next-themes';
import { NextUIProvider } from '@nextui-org/react';
import { SettingsProvider } from '@/contexts/settings-provider';
import SiteSetting from '@/components/admin/site-setting';
import { extend } from 'dayjs';
import { ChildrenType } from '@/types/common';
import { SiteSettingType } from '@/types/settings';

export interface ProvidersProps extends ChildrenType {
	siteSetting: SiteSettingType;
}

export function Providers({ children, siteSetting }: ProvidersProps) {
	return (
		<SettingsProvider siteSetting={siteSetting}>
			<NextThemesProvider
				attribute="class"
				defaultTheme="system"
				enableSystem
				disableTransitionOnChange
			>
				<NextUIProvider>{children}</NextUIProvider>
			</NextThemesProvider>
		</SettingsProvider>
	);
}
