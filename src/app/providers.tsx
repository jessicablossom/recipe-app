'use client';

import { StoreProvider } from '@/store/StoreProvider';

type Props = {
	children: React.ReactNode;
};

export function Providers({ children }: Props) {
	return <StoreProvider>{children}</StoreProvider>;
}
