import { ThemeCategoryPostsPage } from '@/themes';

interface CategoryPostsPageProps {
	params: {
		category: string;
		num: string;
	};
}

export const generateStaticParams = async () => {
	return [];
};

const CategoryPostsPage = ({
	params: { category, num }
}: CategoryPostsPageProps) => {
	let pageNum = Number(num);
	if (!Number.isInteger(pageNum) || pageNum <= 0) {
		pageNum = 1;
	}
	return <ThemeCategoryPostsPage pageNum={pageNum} category={category} />;
};

export default CategoryPostsPage;
