import { getAnalyticsSettingApi, getSiteSettingApi } from '@/apis/setting';
import SettingTabs from '@/components/admin/setting-tabs';

const Page = async () => {
	const siteSetting = await getSiteSettingApi();
	const analyticsSetting = await getAnalyticsSettingApi();
	return (
		<SettingTabs
			siteSetting={siteSetting}
			analyticsSetting={analyticsSetting}
		/>
	);
};

export default Page;
