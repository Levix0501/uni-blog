import { ThemeHomePage } from '@/themes';

interface HomePageProps {
	params: {
		slug?: string[];
	};
}

export const generateStaticParams = async () => {
	return [];
};

export default function Home({ params: { slug } }: HomePageProps) {
	return <ThemeHomePage slug={slug} />;
}
