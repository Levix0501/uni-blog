import to from '@/lib/await-to';
import { notFound } from 'next/navigation';

export const ThemeLayout = async ({
	children
}: {
	children: React.ReactNode;
}) => {
	const theme = 'blog';
	const Layout = (await import(`./${theme}/layout`)).default;

	return <Layout>{children}</Layout>;
};

export const ThemeHomePage = async () => {
	const theme = 'blog';
	const HomePage = (await import(`./${theme}/index`)).default;

	return <HomePage />;
};

export const ThemeAllDocsPage = async ({ pageNum }: { pageNum: number }) => {
	const theme = 'blog';
	const [err, res] = await to(import(`./${theme}/all-docs-page`));

	if (err) {
		notFound();
	}

	const AllDocsPage = res.default;
	return <AllDocsPage pageNum={pageNum} />;
};

export const ThemeCategoryPostsPage = async ({
	pageNum,
	category
}: {
	pageNum: number;
	category: string;
}) => {
	const theme = 'blog';
	const [err, res] = await to(import(`./${theme}/category-posts-page`));

	if (err) {
		notFound();
	}

	const CategoryPostsPage = res.default;
	return <CategoryPostsPage pageNum={pageNum} category={category} />;
};

export const ThemeDocPage = async ({
	category,
	doc
}: {
	category: string;
	doc: string;
}) => {
	const theme = 'blog';
	const DocPage = (await import(`./${theme}/doc-page`)).default;

	return <DocPage category={category} doc={doc} />;
};
