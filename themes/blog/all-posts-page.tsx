import HomeAsideWrapper from './components/home-aside-wrapper';
import PostsPaginationResult from './components/posts-pagination-result';

const Page = ({ pageNum }: { pageNum: number }) => {
	return (
		<>
			<div className="lg:col-span-3">
				<PostsPaginationResult
					page={pageNum}
					generateHref={(page: number) => `/page/${page}`}
				/>
			</div>
			<HomeAsideWrapper />
		</>
	);
};

export default Page;
