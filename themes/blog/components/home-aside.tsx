'use client';

import { SettingApi } from '@/apis/setting';
import { cn, getImageUrl } from '@/lib/utils';
import { Image as ImageType, SideNotice } from '@prisma/client';
import dayjs from 'dayjs';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useMeasure, useWindowSize } from 'react-use';
import FooterInformation from './footer-information';

export interface HomeAsideProps {
	sideNotices: (SideNotice & { image: ImageType | null })[];
}

const HomeAside = ({ sideNotices }: HomeAsideProps) => {
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
				'hidden h-fit lg:block w-[260px] shrink-0 pt-6',
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
					<FooterInformation />
				</li>
			</ul>
		</aside>
	);
};

export default HomeAside;
