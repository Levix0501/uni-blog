'use client';

import { Session } from 'next-auth';
import { getSession } from 'next-auth/react';
import {
	createContext,
	ReactNode,
	useCallback,
	useEffect,
	useState
} from 'react';

export type SessionContextProps = {
	session: Session | null;
	updateSession: () => void;
};

type SessionProviderProps = {
	children: ReactNode;
};

export const SessionContext = createContext<SessionContextProps | null>(null);

export const SessionProvider = ({ children }: SessionProviderProps) => {
	const [session, setSession] = useState<Session | null>(null);

	const updateSession = useCallback(() => {
		getSession()
			.then((session) => {
				setSession(session);
			})
			.catch((e) => console.error(e));
	}, []);

	useEffect(() => {
		updateSession();
	}, []);

	return (
		<SessionContext.Provider value={{ session, updateSession }}>
			{children}
		</SessionContext.Provider>
	);
};
