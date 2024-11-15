import { Boxes, ImageIcon, Megaphone, Pen, Settings } from 'lucide-react';
import { ReactElement, ReactNode } from 'react';

export interface MenuDataItem {
	label: ReactNode;
	icon?: ReactElement;
	href?: string;
	sub?: MenuDataItem[];
}

export const adminMenu: MenuDataItem[] = [
	{
		href: '/admin/post',
		label: '文章管理',
		icon: <Pen size={22} />
	},
	{
		href: '/admin/category',
		label: '分类管理',
		icon: <Boxes size={22} />
	},
	{
		href: '/admin/image',
		label: '图片管理',
		icon: <ImageIcon size={22} />
	},
	{
		href: '/admin/side-notice',
		label: '公告管理',
		icon: <Megaphone size={22} />
	},
	{
		label: '设置',
		icon: <Settings size={22} />,
		sub: [
			{ href: '/admin/settings/site', label: '站点设置' },
			{ href: '/admin/settings/system', label: '系统设置' }
		]
	}
];
