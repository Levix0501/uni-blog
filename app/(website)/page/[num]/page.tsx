import { ThemeAllPostsPage } from '@/themes';

interface AllPostsPageProps {
	params: {
		num: string;
	};
}

export const generateStaticParams = async () => {
	return [];
};

const AllPostsPage = ({ params: { num } }: AllPostsPageProps) => {
	let pageNum = Number(num);
	if (!Number.isInteger(pageNum) || pageNum <= 0) {
		pageNum = 1;
	}
	return <ThemeAllPostsPage pageNum={pageNum} />;
};

export default AllPostsPage;
