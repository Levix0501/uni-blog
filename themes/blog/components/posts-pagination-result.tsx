import { db } from '@/lib/db';
import Feed from './feed';
import HomeAside from './home-aside';
import Pagination from './home-pagination';
import { notFound } from 'next/navigation';

export interface PostsPaginationResultProps {
	page: number;
}

const PostsPaginationResult = async ({ page }: PostsPaginationResultProps) => {
	const size = 10;

	const [posts, total] = await Promise.all([
		db.post.findMany({
			where: { status: 'published' },
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

	const sideNotices = await db.sideNotice.findMany({
		take: await db.sideNotice.count({ where: { status: 'published' } }),
		orderBy: { order: 'asc' },
		include: { image: true }
	});

	return (
		<>
			<div className="lg:col-span-3">
				<ul className="divide-y divide-gray-200 dark:divide-slate-200/5">
					{posts.map((post) => (
						<li key={post.id} className="py-12">
							<Feed post={post} />
						</li>
					))}
				</ul>

				<Pagination currentPage={page} totalPages={Math.ceil(total / size)} />
			</div>

			<HomeAside sideNotices={sideNotices} />
		</>
	);
};

export default PostsPaginationResult;
