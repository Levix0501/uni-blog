import PostsPaginationResult from './components/posts-pagination-result';

const Page = ({ pageNum }: { pageNum: number }) => {
	return <PostsPaginationResult page={pageNum} />;
};

export default Page;
