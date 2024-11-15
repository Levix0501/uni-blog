import { getBasicInfoApi } from '@/apis/setting';
import { cn } from '@/lib/utils';
import { SVGAttributes } from 'react';
import Image from 'next/image';
import { BasicInfoType } from '@/types/site-config';

export interface LogoProps {
	basicInfo: BasicInfoType;
}

const Logo = async ({ basicInfo }: LogoProps) => {
	if (basicInfo.logo) {
		return (
			<div className="relative w-6 h-6">
				<Image
					src={basicInfo.logo}
					alt="Logo"
					fill
					sizes=""
					className="object-contain"
				/>
			</div>
		);
	}

	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="24"
			height="24"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
			className="text-primary"
		>
			<rect x="14" y="14" width="4" height="6" rx="2" />
			<rect x="6" y="4" width="4" height="6" rx="2" />
			<path d="M6 20h4" />
			<path d="M14 10h4" />
			<path d="M6 14h2v6" />
			<path d="M14 4h2v6" />
		</svg>
	);
};

export default Logo;
