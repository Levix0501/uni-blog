export const ThemeLayout = async ({
	children
}: {
	children: React.ReactNode;
}) => {
	const theme = 'blog';
	const Layout = (await import(`./${theme}/layout`)).default;

	return <Layout>{children}</Layout>;
};

interface ThemeHomePageProps {
	slug?: string[];
}

export const ThemeHomePage = async ({ slug }: ThemeHomePageProps) => {
	const theme = 'blog';
	const HomePage = (await import(`./${theme}/index`)).default;

	return <HomePage slug={slug} />;
};
