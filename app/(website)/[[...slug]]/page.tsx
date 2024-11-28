import { ThemeHomePage } from '@/themes';
import { notFound } from 'next/navigation';

interface PageProps {
	params: {
		slug?: string[];
	};
}

export const generateStaticParams = async () => {
	return [];
};

const Page = ({ params: { slug } }: PageProps) => {
	if (!slug) {
		return <ThemeHomePage />;
	}

	notFound();
};

export default Page;
