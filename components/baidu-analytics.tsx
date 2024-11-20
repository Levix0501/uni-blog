import { getAnalyticsSettingApi } from '@/apis/setting';
import Script from 'next/script';

const BaiduAnalytics = async () => {
	const analyticsSetting = await getAnalyticsSettingApi();
	const bdtj = analyticsSetting?.bdtj;
	return (
		process.env.NODE_ENV === 'production' &&
		bdtj && (
			<Script id="bdtj">
				{`var _hmt = _hmt || [];
          (function() {
            var hm = document.createElement("script");
            hm.src = "https://hm.baidu.com/hm.js?${bdtj}";
            var s = document.getElementsByTagName("script")[0]; 
            s.parentNode.insertBefore(hm, s);
          })();`}
			</Script>
		)
	);
};

export default BaiduAnalytics;
