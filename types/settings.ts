import { getSiteSettingApi } from '@/apis/setting';

export type Theme = 'light' | 'dark';

export type ThemeMode = Theme | 'system';

export type Settings = {
	// themeMode?: ThemeMode;
	// systemTheme?: Theme;
	isNavCollapsed?: boolean;
};

export type SiteSettingType = Awaited<ReturnType<typeof getSiteSettingApi>>;
