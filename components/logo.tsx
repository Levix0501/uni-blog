import { getSiteSettingApi } from '@/apis/setting';
import Image from 'next/image';

export interface LogoProps {
	siteSetting: Awaited<ReturnType<typeof getSiteSettingApi>>;
}

const Logo = ({ siteSetting }: LogoProps) => {
	if (siteSetting?.logo) {
		return (
			<div className="relative w-9 h-9">
				<Image
					src={siteSetting.logo.nextImageUrl}
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
			width="1.4583em"
			height="1em"
			viewBox="0 0 35 24"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			className="text-2xl text-primary"
		>
			<path
				fillRule="evenodd"
				clipRule="evenodd"
				d="M0.00188479 0V7.47707C0.00188479 7.47707 -0.145285 9.83135 2.161 11.8242L14.9358 23.9961L21.5792 23.9107L20.5136 10.7809L17.9947 7.82497L10.0778 0H0.00188479Z"
				fill="#5DA5B1"
			></path>
			<path
				opacity="0.06"
				fillRule="evenodd"
				clipRule="evenodd"
				d="M8.39807 17.9307L13.6581 3.53127L18.059 7.91564L8.39807 17.9307Z"
				fill="#F7F3EA"
			></path>
			<path
				opacity="0.06"
				fillRule="evenodd"
				clipRule="evenodd"
				d="M8.81183 17.3645L15.2093 5.06165L18.0926 7.94695L8.81183 17.3645Z"
				fill="#F7F3EA"
			></path>
			<path
				fillRule="evenodd"
				clipRule="evenodd"
				d="M8.47955 17.8436L25.8069 0H34.9091V7.50963C34.9091 7.50963 34.7195 10.0128 33.4463 11.3517L21.5808 24H14.9387L8.47955 17.8436Z"
				fill="#5DA5B1"
			></path>
		</svg>
	);
};

export default Logo;
