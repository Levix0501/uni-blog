'use client';

import { getTotalPostsOfCategoryAction } from '@/actions/category';
import useSWR from 'swr';

export interface CategoryPostsTotalProps {
	category: string;
}

const CategoryPostsTotal = ({ category }: CategoryPostsTotalProps) => {
	const { data } = useSWR(`/${category}/total`, () =>
		getTotalPostsOfCategoryAction(category)
	);

	return <span>{data || '-'}</span>;
};

export default CategoryPostsTotal;
