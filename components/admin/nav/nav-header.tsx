'use client';

import { useAdminNav } from '@/hooks/use-admin-nav';
import { cn } from '@/lib/utils';
import NavCollapseIcon from './nav-collapse-icon';
import Logo from '@/components/logo';
import LogoText from '@/components/logo-text';
import Link from 'next/link';
import { BasicInfoType } from '@/types/site-config';

export interface NavHeaderProps {
	basicInfo: BasicInfoType;
}

const NavHeader = ({ basicInfo }: NavHeaderProps) => {
	const { isCollapsed, isHovered } = useAdminNav();

	return (
		<div
			className={cn(
				'py-5 pl-[1.375rem] pr-4 flex justify-between items-center transition-all',
				{
					'px-[calc((71px-35px)/2)]': isCollapsed && !isHovered
				}
			)}
		>
			<Link href="/admin">
				<div className="flex items-center min-h-7">
					<Logo basicInfo={basicInfo} />
					<LogoText
						className={
							isCollapsed && !isHovered
								? 'opacity-0 ml-0 hidden'
								: 'opacity-100 ml-3'
						}
						basicInfo={basicInfo}
					/>
				</div>
			</Link>

			{(!isCollapsed || isHovered) && <NavCollapseIcon />}
		</div>
	);
};

export default NavHeader;
