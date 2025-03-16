import { ThemeDocPage } from '@/themes';

interface DocPageProps {
	params: {
		category: string;
		doc: string;
	};
}

export const generateStaticParams = async () => {
	return [];
};

export default function DocPage({ params: { category, doc } }: DocPageProps) {
	return <ThemeDocPage category={category} doc={doc} />;
}
