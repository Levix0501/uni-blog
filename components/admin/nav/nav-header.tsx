'use client';

import { getSiteSettingApi } from '@/apis/setting';
import Logo from '@/components/logo';
import LogoText from '@/components/logo-text';
import { useAdminNav } from '@/hooks/use-admin-nav';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import NavCollapseIcon from './nav-collapse-icon';

export interface NavHeaderProps {
	siteSetting: Awaited<ReturnType<typeof getSiteSettingApi>>;
}

const NavHeader = ({ siteSetting }: NavHeaderProps) => {
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
					<Logo siteSetting={siteSetting} />
					<LogoText
						className={
							isCollapsed && !isHovered
								? 'opacity-0 ml-0 hidden'
								: 'opacity-100 ml-3'
						}
						siteSetting={siteSetting}
					/>
				</div>
			</Link>

			{(!isCollapsed || isHovered) && <NavCollapseIcon />}
		</div>
	);
};

export default NavHeader;
