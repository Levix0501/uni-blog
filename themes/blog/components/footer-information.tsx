'use client';

import { useSettings } from '@/hooks/use-settings';
import { uniConfig } from '@/uni.config';
import dayjs from 'dayjs';

const FooterInformation = () => {
	const { siteSetting } = useSettings();

	return (
		<div className="text-center text-xs leading-5 text-slate-500 dark:text-slate-400">
			<p>
				<a
					href="https://beian.miit.gov.cn/"
					target="_blank"
					rel="noopener noreferrer"
				>
					{siteSetting?.icp}
				</a>
			</p>
			<p>
				Powered by{' '}
				<a
					href="https://github.com/Levix0501/uni-blog"
					className="text-slate-700 hover:text-slate-500 transition-colors dark:text-slate-300 dark:hover:text-slate-400"
					target="_blank"
				>
					UniBlog
				</a>
			</p>
			<p>
				© {siteSetting?.year || dayjs().format('YYYY')}{' '}
				{siteSetting?.siteName || uniConfig.siteName}
			</p>
		</div>
	);
};

export default FooterInformation;
