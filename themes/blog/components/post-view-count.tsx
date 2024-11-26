'use client';

import {
	fetchPostViewCountAction,
	updatePostViewCountAction
} from '@/actions/post';
import { Skeleton } from '@/components/ui/skeleton';
import { useEffect, useRef } from 'react';
import { useIntersection } from 'react-use';
import useSWRMutation from 'swr/mutation';

export interface PostViewCountProps {
	postId: number;
	shouldInc?: boolean;
}

const PostViewCount = ({ postId, shouldInc }: PostViewCountProps) => {
	const ref = useRef(null);
	const intersection = useIntersection(ref, {
		root: null, // 使用整个视口
		rootMargin: '0px',
		threshold: 0.1 // 10% 可见时触发
	});
	const { data, isMutating, trigger } = useSWRMutation(
		`/post-view-count/${postId}`,
		() =>
			shouldInc
				? updatePostViewCountAction(postId)
				: fetchPostViewCountAction(postId)
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

export default PostViewCount;
