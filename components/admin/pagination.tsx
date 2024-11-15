'use client';
import { Pagination as PaginationComp } from 'antd';
import { usePathname, useRouter } from 'next/navigation';

export interface PaginationProps {
	page: number;
	size: number;
	total: number;
}

const Pagination = ({ page, size, total }: PaginationProps) => {
	const router = useRouter();
	const pathname = usePathname();

	const handleChange = (page: number, pageSize: number) => {
		router.replace(`${pathname}?page=${page}&size=${pageSize}`);
	};

	return (
		<PaginationComp
			current={page}
			pageSize={size}
			total={total}
			onChange={handleChange}
		/>
	);
};

export default Pagination;
