import type { RatesResponse } from '$lib/types';

const BASE_URL = 'https://api.frankfurter.dev/v1';

export async function fetchLatestRates(
	fetchFn: typeof fetch,
	base = 'EUR'
): Promise<RatesResponse> {
	const url = `${BASE_URL}/latest?base=${encodeURIComponent(base)}`;
	const res = await fetchFn(url);
	if (!res.ok) {
		throw new Error(`Frankfurter request failed: ${res.status}`);
	}
	const data = (await res.json()) as RatesResponse;
	if (!data.rates[base]) {
		data.rates = { ...data.rates, [base]: 1 };
	}
	return data;
}
