import { getAnalyticsSettingApi } from '@/apis/setting';
import { GoogleAnalytics as GA } from '@next/third-parties/google';

const GoogleAnalytics = async () => {
	const analyticsSetting = await getAnalyticsSettingApi();
	const gaId = analyticsSetting?.gaId;
	return process.env.NODE_ENV === 'production' && gaId && <GA gaId={gaId} />;
};

export default GoogleAnalytics;
