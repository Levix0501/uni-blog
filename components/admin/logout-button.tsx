'use client';

import { LogOut } from 'lucide-react';

import { logOutAction } from '@/actions/auth';
import { useSession } from '@/hooks/use-session';

import MenuItem from './menu/menu-item';

const LogoutButton = () => {
	return (
		<MenuItem
			onClick={async () => {
				await logOutAction();
			}}
			icon={<LogOut size={22} />}
			href="#"
		>
			退出
		</MenuItem>
	);
};

export default LogoutButton;
