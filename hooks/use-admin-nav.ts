import { useContext } from 'react';
import { AdminNavContext } from '@/contexts/admin-nav-provider';

export const useAdminNav = () => {
	const context = useContext(AdminNavContext);

	if (!context) {
		throw new Error('useAdminNav must be used within a AdminNavProvider');
	}

	return context;
};
