import { Image } from '@prisma/client';

export type ExtendedImageType = Image & {
	imgUrl: string;
	nextImageUrl: string;
};
