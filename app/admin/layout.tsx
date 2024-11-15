import { ReactNode } from 'react';

import Providers from '@/components/admin/providers';

const AdminLayout = ({ children }: { children: ReactNode }) => {
	return <Providers>{children}</Providers>;
};

export default AdminLayout;
