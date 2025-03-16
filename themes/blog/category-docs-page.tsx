import { notFound } from 'next/navigation';

import { db } from '@/lib/db';

import HomeAsideWrapper from './components/home-aside-wrapper';
import DocsPaginationResult from './components/docs-pagination-result';
import CategoryPostsTotal from './components/category-docs-total';

const Page = async ({
	pageNum,
	category: categorySlug
}: {
	pageNum: number;
	category: string;
}) => {
	const categoryDoc = await db.documentModel.findUnique({
		where: { slug: categorySlug }
	});

	if (!categoryDoc) {
		notFound();
	}

	return (
		<>
			<div className="lg:col-span-3 pt-5 md:pt-8">
				<div className="w-full relative bg-white dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 overflow-hidden">
					<div className="font-heading text-2xl text-slate-700 dark:text-slate-200 font-semibold z-10">
						{categoryDoc.title}
					</div>
					<div className="text-slate-500 dark:text-slate-400">
						共 <CategoryPostsTotal categoryUuid={categoryDoc.uuid} /> 篇文章
					</div>
				</div>

				<DocsPaginationResult
					page={pageNum}
					categoryDoc={categoryDoc}
					generateHref={(page) => `/category/${categoryDoc.slug}/page/${page}`}
				/>
			</div>
			<HomeAsideWrapper />
		</>
	);
};

export default Page;
