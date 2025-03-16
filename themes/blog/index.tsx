import HomeAsideWrapper from './components/home-aside-wrapper';
import PostsPaginationResult from './components/docs-pagination-result';

const HomePage = () => {
	return (
		<>
			<div className="lg:col-span-3">
				<PostsPaginationResult
					page={1}
					generateHref={(page: number) => `/page/${page}`}
				/>
			</div>
			<HomeAsideWrapper />
		</>
	);
};

export default HomePage;
