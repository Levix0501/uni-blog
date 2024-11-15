'use client';

import { ReactNode } from 'react';

import HeaderBar from '@/components/admin/header-bar';

import VerticalNav from './nav';
import { BasicInfoType } from '@/types/site-config';

const DashboardLayout = ({
	children,
	basicInfo
}: {
	children: ReactNode;
	basicInfo: BasicInfoType;
}) => {
	return (
		<div className="flex">
			<VerticalNav basicInfo={basicInfo} />

			<div className="flex-1">
				<HeaderBar />

				<main className="p-4 overflow-hidden">{children}</main>
			</div>
		</div>
	);
};

export default DashboardLayout;
