import { Image } from '@prisma/client';
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export const getImageUrl = (image: Image, isNextImage?: boolean) => {
	if (image.storageType === 'local') {
		if (isNextImage && image.suffix !== 'svg') {
			return `http://caddy/_uni/${image.url}`;
		}
		return `/_uni/${image.url}`;
	}

	return image.url;
};
