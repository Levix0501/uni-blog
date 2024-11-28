import { ThemePostsPaginationPage } from '@/themes';

interface PostsPaginationPageProps {
	params: {
		num: string;
	};
}

export const generateStaticParams = async () => {
	return [];
};

const PostsPaginationPage = ({ params: { num } }: PostsPaginationPageProps) => {
	let pageNum = Number(num);
	if (!Number.isInteger(pageNum) || pageNum <= 0) {
		pageNum = 1;
	}
	return <ThemePostsPaginationPage pageNum={pageNum} />;
};

export default PostsPaginationPage;
