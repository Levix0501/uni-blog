import { useSettings } from '@/hooks/use-settings';
import { getImageUrl } from '@/lib/utils';
import Image from 'next/image';

const Logo = () => {
	const { siteSetting } = useSettings();

	if (siteSetting?.logo) {
		return (
			<div className="relative w-6 h-6">
				<Image
					src={getImageUrl(siteSetting?.logo, true)}
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
