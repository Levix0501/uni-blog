import { ThemePostPage } from '@/themes';

interface PostPageProps {
	params: {
		category: string;
		post: string;
	};
}

export const generateStaticParams = async () => {
	return [];
};

export default function PostPage({
	params: { category, post }
}: PostPageProps) {
	return <ThemePostPage category={category} post={post} />;
}
