'use client';

import { useContext } from 'react';

import { SessionContext } from '@/contexts/session-provider';

export const useSession = () => {
	const context = useContext(SessionContext);

	if (!context) {
		throw new Error('useSessionContext must be used within a SessionProvider');
	}

	return context;
};
