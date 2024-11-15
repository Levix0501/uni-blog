import { adminMenu, MenuDataItem } from '@/constants/admin-menu';
import MenuItem from './menu-item';
import SubMenu from './sub-menu';
import { useAdminNav } from '@/hooks/use-admin-nav';
import { cn } from '@/lib/utils';

const Menu = () => {
	const { isCollapsed, isHovered } = useAdminNav();

	const renderMenuItem = (item: MenuDataItem, index: number) => {
		if (item.sub) {
			return (
				<SubMenu key={index} icon={item.icon} label={item.label} sub={item.sub}>
					{item.sub.map(renderMenuItem)}
				</SubMenu>
			);
		}

		if (item.href) {
			return (
				<MenuItem key={index} href={item.href} icon={item.icon}>
					{item.label}
				</MenuItem>
			);
		}
	};

	return (
		<nav className={cn(isCollapsed && !isHovered && 'w-[47px]')}>
			<ul>{adminMenu.map(renderMenuItem)}</ul>
		</nav>
	);
};

export default Menu;
