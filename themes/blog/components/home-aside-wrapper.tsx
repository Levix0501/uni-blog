import { db } from '@/lib/db';
import HomeAside from './home-aside';
import { getImageUrl } from '@/lib/pic-bed';

const HomeAsideWrapper = async () => {
	const sideNotices = (
		await db.sideNotice.findMany({
			take: await db.sideNotice.count({ where: { status: 'published' } }),
			orderBy: { order: 'asc' },
			include: { image: true }
		})
	).map((e) => ({
		...e,
		image: e.image ? getImageUrl(e.image) : null
	}));

	return <HomeAside sideNotices={sideNotices} />;
};

export default HomeAsideWrapper;
