import { useMedia } from 'react-use';

import { Theme } from '@/types/settings';

export const useSystemTheme = (): Theme => {
	const isDark = useMedia('(prefers-color-scheme: dark)', false);
	return isDark ? 'dark' : 'light';
};
