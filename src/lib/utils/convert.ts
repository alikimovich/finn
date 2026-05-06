export function convertAmount(amount: number, rate: number): number {
	if (!Number.isFinite(amount) || !Number.isFinite(rate)) return 0;
	return amount * rate;
}

export function pairRate(
	rates: Record<string, number>,
	base: string,
	from: string,
	to: string
): number {
	const fromRate = from === base ? 1 : rates[from];
	const toRate = to === base ? 1 : rates[to];
	if (!fromRate || !toRate) return 0;
	return toRate / fromRate;
}
