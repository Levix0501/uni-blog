import { cn } from '@/lib/utils';
import { BasicInfoType } from '@/types/site-config';

export interface LogoTextProps {
	className?: string;
	basicInfo: BasicInfoType;
}

const LogoText = ({ className, basicInfo }: LogoTextProps) => {
	return (
		<span
			className={cn(
				'text-[#444050] text-xl font-semibold transition-all whitespace-nowrap',
				className
			)}
		>
			{basicInfo.siteName || 'UniBlog'}
		</span>
	);
};

export default LogoText;
