export enum PaginationItemType {
	DOTS = 'dots'
}

export interface UsePaginationProps {
	/**
	 * The total number of pages.
	 */
	total: number;
	/**
	 * The controlled selected page.
	 */
	page: number;
	/**
	 * The number of pages to show on each side of the current page.
	 * @default 1
	 */
	siblings?: number;
	/**
	 * The number of pages to show at the beginning and end of the pagination.
	 * @default 1
	 */
	boundaries?: number;
}

export type PaginationItemValue = number | PaginationItemType;

export function range(start: number, end: number) {
	const length = end - start + 1;

	return Array.from({ length }, (_, index) => index + start);
}

export function usePagination(props: UsePaginationProps) {
	const { page: activePage, total, siblings = 1, boundaries = 1 } = props;

	const totalPageNumbers = siblings * 2 + 3 + boundaries * 2;

	if (totalPageNumbers >= total) {
		return range(1, total);
	}
	const leftSiblingIndex = Math.max(activePage - siblings, boundaries);
	const rightSiblingIndex = Math.min(activePage + siblings, total - boundaries);

	/*
	 * We do not want to show dots if there is only one position left
	 * after/before the left/right page count as that would lead to a change if our Pagination
	 * component size which we do not want
	 */
	const shouldShowLeftDots = leftSiblingIndex > boundaries + 2;
	const shouldShowRightDots = rightSiblingIndex < total - (boundaries + 1);

	if (!shouldShowLeftDots && shouldShowRightDots) {
		const leftItemCount = siblings * 2 + boundaries + 2;

		return [
			...range(1, leftItemCount),
			PaginationItemType.DOTS,
			...range(total - (boundaries - 1), total)
		];
	}

	if (shouldShowLeftDots && !shouldShowRightDots) {
		const rightItemCount = boundaries + 1 + 2 * siblings;

		return [
			...range(1, boundaries),
			PaginationItemType.DOTS,
			...range(total - rightItemCount, total)
		];
	}

	return [
		...range(1, boundaries),
		PaginationItemType.DOTS,
		...range(leftSiblingIndex, rightSiblingIndex),
		PaginationItemType.DOTS,
		...range(total - boundaries + 1, total)
	];
}

export type UsePaginationReturn = ReturnType<typeof usePagination>;
