import {
	Pagination,
	PaginationContent,
	PaginationEllipsis,
	PaginationItem,
	PaginationLink
} from '@/components/ui/pagination';
import { PaginationItemType, usePagination } from '@/hooks/use-pagination';

export interface HomePaginationProps {
	currentPage: number;
	totalPages: number;
}

const HomePagination = ({ currentPage, totalPages }: HomePaginationProps) => {
	const range = usePagination({ page: currentPage, total: totalPages });
	const currentIndex = range.findIndex((e) => e === currentPage);

	const generateHref = (page: number) => `/page/${page}`;

	const renderItem = (e: string | number, i: number) => {
		if (e === PaginationItemType.DOTS) {
			let targetPage = currentPage;
			if (i > currentIndex) {
				targetPage += 5;
			} else {
				targetPage -= 5;
			}
			targetPage = Math.min(targetPage, totalPages);
			targetPage = Math.max(1, targetPage);
			return (
				<PaginationLink href={generateHref(targetPage)}>
					<PaginationEllipsis />
				</PaginationLink>
			);
		}

		return (
			<PaginationLink
				href={generateHref(e as number)}
				isActive={currentPage === e}
			>
				{e}
			</PaginationLink>
		);
	};

	return (
		<Pagination>
			<PaginationContent>
				{range.map((e, i) => (
					<PaginationItem key={i}>{renderItem(e, i)}</PaginationItem>
				))}
			</PaginationContent>
		</Pagination>
	);
};

export default HomePagination;
