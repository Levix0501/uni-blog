import useSWR from 'swr';

import { getDocumentAction } from '@/actions/document';
import { useDocumentSetting } from './use-document-setting';

export const useEditingDocument = () => {
	const slug = useDocumentSetting((state) => state.slug);
	const editingDocument = useSWR(
		slug ? ['getDocumentAction', slug] : null,
		([, slug]) => getDocumentAction({ slug })
	);

	return editingDocument;
};
