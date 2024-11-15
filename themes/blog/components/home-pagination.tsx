'use client';

import { Pagination } from '@nextui-org/pagination';
import { useRouter } from 'next/navigation';

export interface HomePaginationProps {
	total: number;
	page: number;
}

const HomePagination = ({ total, page }: HomePaginationProps) => {
	const router = useRouter();

	return (
		<Pagination
			total={total}
			page={page}
			onChange={(page) => router.replace(`/${page}`)}
		/>
	);
};

export default HomePagination;
