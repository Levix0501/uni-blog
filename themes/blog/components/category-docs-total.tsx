'use client';

import { getTotalDocsByCategoryAction } from '@/actions/document';
import useSWR from 'swr';

export interface CategoryDocsTotalProps {
	categoryUuid: string;
}

const CategoryDocsTotal = ({ categoryUuid }: CategoryDocsTotalProps) => {
	const { data } = useSWR(`/${categoryUuid}/total`, () =>
		getTotalDocsByCategoryAction(categoryUuid)
	);

	return <span>{data || '-'}</span>;
};

export default CategoryDocsTotal;
