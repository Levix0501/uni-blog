'use server';

import { revalidatePath } from 'next/cache';

export const revalidateAllAction = async () => {
	revalidatePath('/', 'layout');
};
