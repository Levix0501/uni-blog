import { ReactElement, ReactNode, useEffect, useState } from 'react';
import MenuButton from './menu-button';
import { cn } from '@/lib/utils';

import { usePathname } from 'next/navigation';
import { MenuDataItem } from '@/constants/admin-menu';
import { useAdminNav } from '@/hooks/use-admin-nav';

export interface SubMenuProps {
	icon?: ReactElement;
	label: ReactNode;
	children: ReactNode;
	sub: MenuDataItem[];
}

const SubMenu = ({ icon, children, label, sub }: SubMenuProps) => {
	const pathname = usePathname();
	const [isSubMenuOpen, setIsSubMenuOpen] = useState(false);
	const { isCollapsed, isHovered } = useAdminNav();
	const collapsedNotHovered = isCollapsed && !isHovered;

	useEffect(() => {
		let flag = false;
		const findHref = (sub: MenuDataItem[]) => {
			for (const item of sub) {
				if (flag) break;

				if (item.href === pathname) {
					flag = true;
					break;
				}

				if (item.sub) {
					findHref(item.sub);
				}
			}
		};
		findHref(sub);
		setIsSubMenuOpen(flag);
	}, [pathname, sub]);

	return (
		<li className="mt-1">
			<MenuButton
				icon={icon}
				type="sub"
				isSubMenuOpen={isSubMenuOpen}
				onClick={() => setIsSubMenuOpen((prevState) => !prevState)}
			>
				{label}
			</MenuButton>

			<div
				className={cn(
					'overflow-hidden',
					isSubMenuOpen && !collapsedNotHovered ? 'h-auto' : 'h-0'
				)}
			>
				<ul>{children}</ul>
			</div>
		</li>
	);
};

export default SubMenu;
