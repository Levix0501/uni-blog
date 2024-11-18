import { SettingApi } from '@/apis/setting';
import dayjs from 'dayjs';

export interface FooterInformationProps {
	basicInfo: SettingApi.GetBasicInfoResult;
}

const FooterInformation = ({ basicInfo }: FooterInformationProps) => {
	return (
		<div className="grid grid-cols-2 gap-y-2">
			<hr className="my-4 col-span-2 w-full h-px bg-slate-200 dark:border-slate-800" />
			<div className="col-span-2 text-slate-600 dark:text-slate-300">
				<a
					href="https://beian.miit.gov.cn/"
					target="_blank"
					rel="noopener noreferrer"
				>
					<span className="inline-block break-words text-slate-500 dark:text-slate-400">
						{basicInfo.icp}
					</span>
				</a>
			</div>

			<div className="col-span-2 text-slate-600 dark:text-slate-300">
				<a
					href="https://github.com/Levix0501/uni-blog"
					className="font-medium text-slate-500 dark:text-slate-400 hover:underline"
				>
					Powered by UniBlog
				</a>
				<span className="inline-block mx-2 font-bold opacity-50">·</span>
				<span className="inline-block break-words text-slate-500 dark:text-slate-400">
					© {basicInfo.year || dayjs().format('YYYY')} {basicInfo.siteName}
				</span>
			</div>
		</div>
	);
};

export default FooterInformation;
