import { ReactNode } from 'react';

import AntdProvider from '@/contexts/antd-provider';
import { SessionProvider } from '@/contexts/session-provider';

interface Props {
	children: ReactNode;
}

const Providers = ({ children }: Props) => {
	return (
		<SessionProvider>
			<AntdProvider>{children}</AntdProvider>
		</SessionProvider>
	);
};

export default Providers;
