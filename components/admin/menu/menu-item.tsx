import { ChildrenType } from '@/types/common';
import MenuButton, { MenuButtonProps } from './menu-button';

export type MenuItemProps = ChildrenType &
	MenuButtonProps & {
		onClick?: () => void;
	};

const MenuItem = ({ onClick, children, ...rest }: MenuItemProps) => {
	return (
		<li onClick={onClick} className="mt-1">
			<MenuButton {...rest}>{children}</MenuButton>
		</li>
	);
};

export default MenuItem;
