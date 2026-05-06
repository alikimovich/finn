import type { CurrencyCode, RatesResponse, TimeseriesResponse } from '$lib/types';

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

export async function fetchTimeseries(
	fetchFn: typeof fetch,
	from: CurrencyCode,
	to: CurrencyCode,
	startDate: string
): Promise<TimeseriesResponse> {
	const url = `${BASE_URL}/${startDate}..?base=${encodeURIComponent(from)}&symbols=${encodeURIComponent(to)}`;
	const res = await fetchFn(url);
	if (!res.ok) {
		throw new Error(`Frankfurter timeseries failed: ${res.status}`);
	}
	return (await res.json()) as TimeseriesResponse;
}

export function isoDaysAgo(days: number, today = new Date()): string {
	const d = new Date(today);
	d.setUTCDate(d.getUTCDate() - days);
	return d.toISOString().slice(0, 10);
}
