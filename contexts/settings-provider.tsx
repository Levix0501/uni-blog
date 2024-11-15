'use client';

import { ReactNode, createContext, useEffect, useState } from 'react';
import { useLocalStorage } from 'react-use';

import { uniConfig } from '@/uni.config';
import { Settings } from '@/types/settings';

export type SettingsContextProps = {
	settings: Settings;
	updateSettings: (settings: Partial<Settings>) => void;
};

type SettingsProviderProps = {
	children: ReactNode;
};

export const SettingsContext = createContext<SettingsContextProps | null>(null);

export const SettingsProvider = ({ children }: SettingsProviderProps) => {
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
			value={{ settings: settingsState, updateSettings }}
		>
			{children}
		</SettingsContext.Provider>
	);
};
