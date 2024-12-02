import { db } from '@/lib/db';
import { notFound } from 'next/navigation';
import Feed from './feed';
import Pagination from './home-pagination';

export interface PostsPaginationResultProps {
	page: number;
	category?: string;
	generateHref: (page: number) => string;
}

const PostsPaginationResult = async ({
	page,
	category,
	generateHref
}: PostsPaginationResultProps) => {
	const size = 10;

	const [posts, total] = await Promise.all([
		db.post.findMany({
			where: {
				status: 'published',
				category: category ? { slug: category } : void 0
			},
			skip: (page - 1) * 10,
			take: size,
			orderBy: { createTime: 'desc' },
			include: { cover: true, category: true }
		}),
		db.post.count()
	]);

	if (posts.length === 0) {
		notFound();
	}

	return (
		<>
			<ul className="divide-y divide-gray-200 dark:divide-slate-200/5">
				{posts.map((post) => (
					<li key={post.id} className="py-12">
						<Feed post={post} />
					</li>
				))}
			</ul>

			<Pagination
				currentPage={page}
				totalPages={Math.ceil(total / size)}
				generateHref={generateHref}
			/>
		</>
	);
};

export default PostsPaginationResult;
