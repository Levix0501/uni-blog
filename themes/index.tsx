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

export const ThemePostsPaginationPage = async ({
	pageNum
}: {
	pageNum: number;
}) => {
	const theme = 'blog';
	const [err, res] = await to(import(`./${theme}/posts-pagination-page`));

	if (err) {
		notFound();
	}

	const PostsPaginationPage = res.default;
	return <PostsPaginationPage pageNum={pageNum} />;
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
