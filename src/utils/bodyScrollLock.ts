let lockCount = 0;

export function lockBodyScroll(): void {
	if (typeof document === 'undefined') return;
	if (lockCount === 0) {
		document.body.dataset.prevOverflow = document.body.style.overflow || '';
		document.body.style.overflow = 'hidden';
	}
	lockCount += 1;
}

export function unlockBodyScroll(): void {
	if (typeof document === 'undefined') return;
	if (lockCount === 0) return;
	lockCount -= 1;
	if (lockCount === 0) {
		const prev = document.body.dataset.prevOverflow ?? '';
		document.body.style.overflow = prev;
		delete document.body.dataset.prevOverflow;
	}
}

