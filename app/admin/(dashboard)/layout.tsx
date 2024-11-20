import { getSiteSettingApi } from '@/apis/setting';
import DashboardLayout from '@/components/admin/dashboard-layout';
import { ChildrenType } from '@/types/common';

const Layout = async ({ children }: ChildrenType) => {
	const siteSetting = await getSiteSettingApi();

	return (
		<DashboardLayout siteSetting={siteSetting}>{children}</DashboardLayout>
	);
};

export default Layout;
