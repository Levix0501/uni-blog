import { db } from '@/lib/db';
import HomeAside from './home-aside';

const HomeAsideWrapper = async () => {
	const sideNotices = await db.sideNotice.findMany({
		take: await db.sideNotice.count({ where: { status: 'published' } }),
		orderBy: { order: 'asc' },
		include: { image: true }
	});

	return <HomeAside sideNotices={sideNotices} />;
};

export default HomeAsideWrapper;
