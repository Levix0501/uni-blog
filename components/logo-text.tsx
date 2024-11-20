import { getSiteSettingApi } from '@/apis/setting';
import { cn } from '@/lib/utils';

export interface LogoTextProps {
	className?: string;
	siteSetting: Awaited<ReturnType<typeof getSiteSettingApi>>;
}

const LogoText = ({ className, siteSetting }: LogoTextProps) => {
	return (
		<span
			className={cn(
				'text-[#444050] text-xl font-semibold transition-all whitespace-nowrap',
				className
			)}
		>
			{siteSetting?.siteName || 'UniBlog'}
		</span>
	);
};

export default LogoText;
