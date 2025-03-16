import {
	CatelogNodeType,
	getAllCatelogNodesAction,
	updateAllCatelogNodesAction
} from '@/actions/document';
import useSWR from 'swr';

export const useCatelogDataFetcher = () => {
	const { data, mutate } = useSWR('getAllCatelogNodesAction', () =>
		getAllCatelogNodesAction()
	);

	const updateCatelogData = async (nodes: CatelogNodeType[]) => {
		const trigger = async () => {
			const result = await updateAllCatelogNodesAction(nodes);
			return result || nodes;
		};

		return mutate(trigger(), {
			revalidate: false
		});
	};

	return {
		data,
		updateCatelogData
	};
};
