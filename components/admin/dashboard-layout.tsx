'use client';

import HeaderBar from '@/components/admin/header-bar';

import { getSiteSettingApi } from '@/apis/setting';
import { ChildrenType } from '@/types/common';
import VerticalNav from './nav';

export interface DashboardLayoutProps extends ChildrenType {
	siteSetting: Awaited<ReturnType<typeof getSiteSettingApi>>;
}

const DashboardLayout = ({ children, siteSetting }: DashboardLayoutProps) => {
	return (
		<div className="flex">
			<VerticalNav siteSetting={siteSetting} />

			<div className="flex-1">
				<HeaderBar />

				<main className="p-4 overflow-hidden">{children}</main>
			</div>
		</div>
	);
};

export default DashboardLayout;
