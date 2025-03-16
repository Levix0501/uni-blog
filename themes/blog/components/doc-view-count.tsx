'use client';

import { RefObject, useEffect, useRef } from 'react';
import { useIntersection } from 'react-use';
import useSWRMutation from 'swr/mutation';
import { DocumentModel } from '@prisma/client';

import { Skeleton } from '@/components/ui/skeleton';
import {
	fetchDocViewCountAction,
	updateDocViewCountAction
} from '@/actions/document';

export interface DocViewCountProps {
	docId: DocumentModel['id'];
	shouldInc?: boolean;
}

const DocViewCount = ({ docId, shouldInc }: DocViewCountProps) => {
	const ref = useRef<HTMLDivElement>(null);
	const intersection = useIntersection(ref as RefObject<HTMLDivElement>, {
		root: null, // 使用整个视口
		rootMargin: '0px',
		threshold: 0.1 // 10% 可见时触发
	});
	const { data, isMutating, trigger } = useSWRMutation(
		`/doc-view-count/${docId}`,
		() =>
			shouldInc
				? updateDocViewCountAction(docId)
				: fetchDocViewCountAction(docId)
	);

	useEffect(() => {
		if (intersection && intersection.isIntersecting && !data && !isMutating) {
			trigger();
		}
	}, [intersection]);

	return (
		<div ref={ref}>
			{(isMutating || !data) && <Skeleton className="w-6 h-6" />}
			{data && data.success}
		</div>
	);
};

export default DocViewCount;
