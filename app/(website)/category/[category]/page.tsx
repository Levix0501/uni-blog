import { redirect } from 'next/navigation';

interface PageProps {
	params: {
		category: string;
	};
}

const Page = ({ params: { category } }: PageProps) => {
	redirect(`/category/${category}/page/1`);
};

export default Page;
