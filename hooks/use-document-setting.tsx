import { getDocumentAction } from '@/actions/document';
import { DocumentModel } from '@prisma/client';
import { create } from 'zustand';

export type EditingDocumentType = Awaited<ReturnType<typeof getDocumentAction>>;

type DocumentSettingStore = {
	slug?: DocumentModel['slug'];
	base64Cover?: string;
	isSheetOpen: boolean;
	onSheetOpenChange: (val: boolean) => void;
	setBase64Cover: (val?: string) => void;
	setDocumentSlug: (val: string) => void;
};

export const useDocumentSetting = create<DocumentSettingStore>((set) => ({
	isSheetOpen: false,
	onSheetOpenChange: (isSheetOpen) => set({ isSheetOpen }),
	setBase64Cover: (base64Cover) => set({ base64Cover }),
	setDocumentSlug: (slug) => set({ slug })
}));
