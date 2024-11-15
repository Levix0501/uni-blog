import MDEditor from '@/components/admin/editor';
import { db } from '@/lib/db';
import { notFound } from 'next/navigation';

interface EditorEditPageProps {
	params: { slug: string };
}

const Page = async ({ params: { slug } }: EditorEditPageProps) => {
	const id = Number(slug);
	if (Number.isNaN(id)) {
		return notFound();
	}

	const post = await db.post.findUnique({
		where: { id },
		include: { cover: true }
	});

	if (!post) {
		return notFound();
	}

	return <MDEditor post={post} />;
};

export default Page;