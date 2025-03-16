// import { getDocumentAction } from '@/actions/documents';
// import { create } from 'zustand';

// export type EditingDocumentType = Awaited<ReturnType<typeof getDocumentAction>>;

// type EditingDocumentStore = {
// 	value: EditingDocumentType;
// 	base64Cover?: string;
// 	isSheetOpen: boolean;
// 	onSheetOpenChange: (val: boolean) => void;
// 	setEditingDocument: (val: EditingDocumentType) => void;
// 	setBase64Cover: (val: string) => void;
// };

// export const useEditingDocument = create<EditingDocumentStore>((set) => ({
// 	value: null,
// 	isSheetOpen: false,
// 	onSheetOpenChange: (isSheetOpen) => set({ isSheetOpen }),
// 	setEditingDocument: (value) => set({ value }),
// 	setBase64Cover: (base64Cover) => set({ base64Cover })
// }));
