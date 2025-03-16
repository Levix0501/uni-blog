import { create } from 'zustand';

type CoverImageStore = {
	isOpen: boolean;
	onOpen: () => void;
	onClose: () => void;
	onOpenChange: (value: boolean) => void;
};

export const useCoverImage = create<CoverImageStore>((set) => ({
	isOpen: false,
	onOpen: () => set({ isOpen: true }),
	onClose: () => set({ isOpen: false }),
	onOpenChange: (value) => set({ isOpen: value })
}));
