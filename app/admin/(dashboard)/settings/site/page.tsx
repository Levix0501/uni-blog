import { getAnalyticsSettingApi, getBasicInfoApi } from '@/apis/setting';
import AnalyticsSetting from '@/components/admin/analytics-setting';
import BasicInfo from '@/components/admin/basic-info';

const Page = async () => {
	const basicInfo = await getBasicInfoApi();
	const analyticsSetting = await getAnalyticsSettingApi();
	return (
		<div className="space-y-4">
			<BasicInfo defaultValues={basicInfo} />
			<AnalyticsSetting defaultValues={analyticsSetting} />
		</div>
	);
};

export default Page;
