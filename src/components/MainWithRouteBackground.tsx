type Props = {
	children: React.ReactNode;
};

export function MainWithRouteBackground({ children }: Props) {
	return <main className='main-with-safe-area flex-1 w-full bg-white'>{children}</main>;
}
