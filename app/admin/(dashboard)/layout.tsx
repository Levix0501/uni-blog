import { getBasicInfoApi } from '@/apis/setting';
import DashboardLayout from '@/components/admin/dashboard-layout';
import { ChildrenType } from '@/types/common';

const Layout = async ({ children }: ChildrenType) => {
	const basicInfo = await getBasicInfoApi();
	return <DashboardLayout basicInfo={basicInfo}>{children}</DashboardLayout>;
};

export default Layout;
