'use client';

import { ReactNode, createContext, useEffect, useState } from 'react';
import { useLocalStorage } from 'react-use';

import { uniConfig } from '@/uni.config';
import { Settings, SiteSettingType } from '@/types/settings';
import { getSiteSettingApi } from '@/apis/setting';

export type SettingsContextProps = {
	siteSetting: SiteSettingType;
	settings: Settings;
	updateSettings: (settings: Partial<Settings>) => void;
};

type SettingsProviderProps = {
	children: ReactNode;
	siteSetting: SiteSettingType;
};

export const SettingsContext = createContext<SettingsContextProps | null>(null);

export const SettingsProvider = ({
	children,
	siteSetting
}: SettingsProviderProps) => {
	const [settings, updateSettingsStorage] = useLocalStorage<Settings>(
		uniConfig.settingsStorageKey
	);

	const [settingsState, setSettingsState] = useState<Settings>({});

	const updateSettings = (_settings: Partial<Settings>) => {
		setSettingsState((prev) => {
			const newSettings = { ...prev, ..._settings };
			updateSettingsStorage(newSettings);
			return newSettings;
		});
	};

	useEffect(() => {
		if (settings) {
			setSettingsState(settings);
		}
	}, []);

	return (
		<SettingsContext.Provider
			value={{ settings: settingsState, updateSettings, siteSetting }}
		>
			{children}
		</SettingsContext.Provider>
	);
};
