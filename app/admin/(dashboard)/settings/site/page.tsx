import { getAnalyticsSettingApi, getSiteSettingApi } from '@/apis/setting';
import AnalyticsSetting from '@/components/admin/analytics-setting';
import SiteSetting from '@/components/admin/site-setting';

const Page = async () => {
	const siteSetting = await getSiteSettingApi();
	const analyticsSetting = await getAnalyticsSettingApi();
	return (
		<div className="space-y-4">
			<SiteSetting siteSetting={siteSetting} />
			<AnalyticsSetting defaultValues={analyticsSetting} />
		</div>
	);
};

export default Page;
