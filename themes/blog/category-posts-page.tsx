import { db } from '@/lib/db';
import HomeAsideWrapper from './components/home-aside-wrapper';
import PostsPaginationResult from './components/posts-pagination-result';
import { notFound } from 'next/navigation';
import CategoryPostsTotal from './components/category-posts-total';

const Page = async ({
	pageNum,
	category: slug
}: {
	pageNum: number;
	category: string;
}) => {
	const category = await db.category.findUnique({ where: { slug } });

	if (!category) {
		notFound();
	}

	return (
		<>
			<div className="lg:col-span-3 pt-5 md:pt-8">
				<div className="w-full relative bg-white dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 overflow-hidden">
					<div className="font-heading text-2xl text-slate-700 dark:text-slate-200 font-semibold z-10">
						{category.name}
					</div>
					<div className="text-slate-500 dark:text-slate-400">
						共 <CategoryPostsTotal category={slug} /> 篇文章
					</div>
				</div>

				<PostsPaginationResult
					page={pageNum}
					category={slug}
					generateHref={(page) => `/category/${slug}/page/${page}`}
				/>
			</div>
			<HomeAsideWrapper />
		</>
	);
};

export default Page;
