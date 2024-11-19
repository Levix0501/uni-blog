'use client';
import { AppProgressBar } from 'next-nprogress-bar';

export const NprogressBar = () => {
	return <AppProgressBar options={{ showSpinner: false }} />;
};
