import { Home } from 'lucide-react';
import LogoutButton from '../logout-button';
import MenuItem from '../menu/menu-item';

const NavFooter = () => {
	return (
		<div className="px-3">
			<div className="sm:justify-start border-t border-[#E5E7EB] py-2">
				<ul>
					<MenuItem icon={<Home size={22} />} href="/" target="_blank">
						主站
					</MenuItem>

					<LogoutButton />
				</ul>
			</div>
		</div>
	);
};

export default NavFooter;
