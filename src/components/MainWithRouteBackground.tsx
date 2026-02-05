type Props = {
	children: React.ReactNode;
};

export function MainWithRouteBackground({ children }: Props) {
	return <main className='flex-1 w-full pt-16 bg-white'>{children}</main>;
}
