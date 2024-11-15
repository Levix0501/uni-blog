import { ReactNode } from 'react';

import { AdminNavProvider } from '@/contexts/admin-nav-provider';
import { SessionProvider } from '@/contexts/session-provider';
import { SettingsProvider } from '@/contexts/settings-provider';
import AntdProvider from '@/contexts/antd-provider';

interface Props {
	children: ReactNode;
}

const Providers = ({ children }: Props) => {
	return (
		<SessionProvider>
			<SettingsProvider>
				<AntdProvider>
					<AdminNavProvider>{children}</AdminNavProvider>
				</AntdProvider>
			</SettingsProvider>
		</SessionProvider>
	);
};

export default Providers;
