'use client';

import { useSettings } from '@/hooks/use-settings';
import { ReactNode, createContext, useEffect, useRef, useState } from 'react';
import { useMedia } from 'react-use';

export interface AdminNavState {
	isCollapsed?: boolean;
	isHovered?: boolean;
	collapsing?: boolean;
	expanding?: boolean;
	isBreakpointReached?: boolean;
	isToggled?: boolean;
}

export type AdminNavContextProps = AdminNavState & {
	updateAdminNavState: (state: AdminNavState) => void;
	toggleCollapseNav: () => void;
};

type AdminNavProviderProps = {
	children: ReactNode;
};

export const AdminNavContext = createContext<AdminNavContextProps | null>(null);

export const AdminNavProvider = ({ children }: AdminNavProviderProps) => {
	const isBreakpointReached = useMedia('(max-width:767px)');
	const { settings, updateSettings } = useSettings();
	const [adminNavState, setAdminNavState] = useState<AdminNavState>({});

	const collapsedRef = useRef(false);

	const updateAdminNavState = (value: AdminNavState) => {
		setAdminNavState((prevState) => ({
			...prevState,
			...value
		}));
	};

	const toggleCollapseNav = () => {
		setAdminNavState((prevState) => {
			const newAdminNavState: AdminNavState = {
				...prevState,
				isCollapsed: !prevState.isCollapsed,
				isHovered: false,
				collapsing: !prevState.isCollapsed,
				expanding: prevState.isCollapsed
			};
			return newAdminNavState;
		});
	};

	useEffect(() => {
		if (adminNavState.isCollapsed === void 0) {
			updateAdminNavState({ isCollapsed: settings.isNavCollapsed });
		}
	}, [adminNavState.isCollapsed, settings.isNavCollapsed]);

	useEffect(() => {
		if (
			adminNavState.isCollapsed !== void 0 &&
			adminNavState.isCollapsed !== settings.isNavCollapsed
		) {
			updateSettings({ isNavCollapsed: adminNavState.isCollapsed });
		}
	}, [adminNavState.isCollapsed, settings.isNavCollapsed, updateSettings]);

	useEffect(() => {
		setTimeout(
			() => updateAdminNavState({ collapsing: false, expanding: false }),
			150
		);

		if (
			!isBreakpointReached &&
			!adminNavState.isCollapsed &&
			collapsedRef.current
		) {
			collapsedRef.current = false;
		}
	}, [adminNavState.isCollapsed, isBreakpointReached]);

	useEffect(() => {
		if (isBreakpointReached !== adminNavState.isBreakpointReached) {
			updateAdminNavState({ isBreakpointReached });
		}

		if (isBreakpointReached) {
			if (adminNavState.isCollapsed && !collapsedRef.current) {
				collapsedRef.current = true;
			}

			adminNavState.isCollapsed && updateAdminNavState({ isCollapsed: false });
		} else {
			updateAdminNavState({ isToggled: false });
			collapsedRef.current && updateAdminNavState({ isCollapsed: true });
		}
	}, [
		adminNavState.isBreakpointReached,
		adminNavState.isCollapsed,
		isBreakpointReached
	]);

	return (
		<AdminNavContext.Provider
			value={{
				...adminNavState,
				updateAdminNavState,
				toggleCollapseNav
			}}
		>
			{children}
		</AdminNavContext.Provider>
	);
};
