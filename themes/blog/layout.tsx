import { getSiteSettingApi } from '@/apis/setting';
import { ChildrenType } from '@/types/common';
import FooterInformation from './components/footer-information';
import { HeaderBar } from './components/header-bar';

const Layout = async ({ children }: ChildrenType) => {
	return (
		<>
			<HeaderBar />
			<main className="max-w-3xl mx-auto px-4 sm:px-6 xl:max-w-5xl xl:px-0 lg:grid lg:grid-cols-4 lg:gap-x-10">
				{children}
			</main>
			<footer className="text-sm pb-6 px-4 sm:px-6 lg:hidden">
				<FooterInformation />
			</footer>
		</>
	);
};

export default Layout;
