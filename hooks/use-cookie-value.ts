import { useMemo } from 'react';
import { useCookie } from 'react-use';

export const useCookieValue = <T>(
	cookieName: string,
	fallback?: T
): [T, (newVal: T) => void] => {
	const [_value, updateCookie] = useCookie(cookieName);

	const value = useMemo<T>(
		() => (_value ? JSON.parse(_value) : fallback),
		[_value, fallback]
	);

	const updateValue = (newVal: T) => {
		updateCookie(JSON.stringify(newVal));
	};

	return [value, updateValue];
};
