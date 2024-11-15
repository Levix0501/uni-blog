'use client';

import { SettingApi } from '@/apis/setting';
import { cn, getImageUrl } from '@/lib/utils';
import { Image as ImageType, SideNotice } from '@prisma/client';
import dayjs from 'dayjs';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useMeasure, useWindowSize } from 'react-use';

export interface HomeAsideProps {
	sideNotices: (SideNotice & { image: ImageType | null })[];
	basicInfo: SettingApi.GetBasicInfoResult;
}

const HomeAside = ({ sideNotices, basicInfo }: HomeAsideProps) => {
	const [asideRef, { height }] = useMeasure<HTMLElement>();
	const { height: windowHeight } = useWindowSize();
	const [isSticky, setIsSticky] = useState(false);

	useEffect(() => {
		const handleScroll = () => {
			const scrollY = window.scrollY || document.documentElement.scrollTop;
			setIsSticky(scrollY >= height - (windowHeight - 64));
		};

		handleScroll();

		window.addEventListener('scroll', handleScroll);
		return () => {
			window.removeEventListener('scroll', handleScroll);
		};
	}, []);

	return (
		<aside
			className={cn(
				'hidden h-fit md:block w-[260px] shrink-0 pt-6',
				isSticky ? 'sticky' : 'relative'
			)}
			ref={asideRef}
			style={{ top: isSticky ? Math.min(64, windowHeight - height) + 'px' : 0 }}
		>
			<ul className="space-y-4">
				{sideNotices.map((e) => (
					<li
						key={e.id}
						className={cn(
							'rounded-md overflow-hidden border border-[rgba(0,0,0,0.08)]',
							{
								'flex items-center': e.orientation === 'horizontal',
								'p-2': e.name || e.desc
							}
						)}
					>
						<div className="flex-1 space-y-1">
							{e.name && <h2 className="font-bold">{e.name}</h2>}

							{e.desc && (
								<div className="text-slate-600 text-xs">
									<p>{e.desc}</p>
								</div>
							)}
						</div>
						<div
							className={cn(
								'shrink-0',
								e.orientation === 'horizontal' ? 'w-[100px]' : 'w-full'
							)}
						>
							{e.image && (
								<div
									className="relative rounded-lg overflow-hidden"
									style={{
										paddingBottom: (e.image.height / e.image.width) * 100 + '%'
									}}
								>
									<Image
										src={getImageUrl(e.image, true)}
										alt=""
										fill
										sizes="288px"
										className="object-contain"
									/>
								</div>
							)}
						</div>
					</li>
				))}

				<li className="text-xs">
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
								© {basicInfo.year || dayjs().format('YYYY')}{' '}
								{basicInfo.siteName}
							</span>
						</div>
					</div>
				</li>
			</ul>
		</aside>
	);
};

export default HomeAside;
