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

export const ThemeAllPostsPage = async ({ pageNum }: { pageNum: number }) => {
	const theme = 'blog';
	const [err, res] = await to(import(`./${theme}/all-posts-page`));

	if (err) {
		notFound();
	}

	const AllPostsPage = res.default;
	return <AllPostsPage pageNum={pageNum} />;
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

export const ThemePostPage = async ({
	category,
	post
}: {
	category: string;
	post: string;
}) => {
	const theme = 'blog';
	const PostPage = (await import(`./${theme}/post-page`)).default;

	return <PostPage category={category} post={post} />;
};
