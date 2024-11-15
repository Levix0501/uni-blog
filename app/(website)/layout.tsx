import { ThemeLayout } from '@/themes';
import { ChildrenType } from '@/types/common';

const Layout = ({ children }: ChildrenType) => {
	return <ThemeLayout>{children}</ThemeLayout>;
};

export default Layout;
