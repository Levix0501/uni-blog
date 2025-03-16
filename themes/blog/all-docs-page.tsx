import HomeAsideWrapper from './components/home-aside-wrapper';
import DocsPaginationResult from './components/docs-pagination-result';

const Page = ({ pageNum }: { pageNum: number }) => {
	return (
		<>
			<div className="lg:col-span-3">
				<DocsPaginationResult
					page={pageNum}
					generateHref={(page: number) => `/page/${page}`}
				/>
			</div>
			<HomeAsideWrapper />
		</>
	);
};

export default Page;
