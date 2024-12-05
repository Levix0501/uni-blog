'use client';
import { Tab, Tabs } from '@nextui-org/react';
import SiteSetting from './site-setting';
import { getSiteSettingApi } from '@/apis/setting';
import AnalyticsSetting from './analytics-setting';
import { AnalyticsSetting as AnalyticsSettingType } from '@prisma/client';
import ResetAdminPassword from './reset-admin-password';

export interface SettingTabsProps {
	siteSetting: Awaited<ReturnType<typeof getSiteSettingApi>>;
	analyticsSetting: AnalyticsSettingType | null;
}

const SettingTabs = ({ siteSetting, analyticsSetting }: SettingTabsProps) => {
	return (
		<Tabs>
			<Tab key="site" title="站点信息">
				<SiteSetting siteSetting={siteSetting} />
			</Tab>
			<Tab key="analytics" title="数据统计">
				<AnalyticsSetting defaultValues={analyticsSetting} />
			</Tab>
			<Tab key="admin" title="管理账号">
				<ResetAdminPassword />
			</Tab>
		</Tabs>
	);
};

export default SettingTabs;
