import { Image } from '@prisma/client';
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export const getImageUrl = (image: Image, isNextImage?: boolean) => {
	if (image.storageType === 'local') {
		return isNextImage
			? `http://caddy/_uni/${image.url}`
			: `/_uni/${image.url}`;
	}

	return image.url;
};
