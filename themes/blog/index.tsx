import { db } from '@/lib/db';
import Feed from './components/feed';
import HomeAside from './components/home-aside';
import HomePagination from './components/home-pagination';
import PostPage from './components/post-page';
import { getBasicInfoApi } from '@/apis/setting';

interface PageProps {
	slug?: string[];
}

const Page = async ({ slug }: PageProps) => {
	if (slug && slug.length === 2) {
		return <PostPage category={slug[0]} postSlugOrId={slug[1]} />;
	}

	let page = 1,
		size = 10;
	if (slug && slug.length === 1) {
		const pageNum = Number(slug[0]);
		if (Number.isInteger(pageNum)) {
			page = pageNum;
		}
	}

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

	const sideNotices = await db.sideNotice.findMany({
		take: await db.sideNotice.count({ where: { status: 'published' } }),
		orderBy: { order: 'asc' },
		include: { image: true }
	});

	const basicInfo = await getBasicInfoApi();

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

				<HomePagination total={Math.ceil(total / size)} page={page} />
			</div>

			<HomeAside sideNotices={sideNotices} basicInfo={basicInfo} />
		</>
	);
};

export default Page;
