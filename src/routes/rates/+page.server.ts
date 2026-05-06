import type { PageServerLoad } from './$types';
import { fetchTimeseries, isoDaysAgo } from '$lib/server/frankfurter';
import type { CurrencyCode, RatePoint, RateSeries } from '$lib/types';

const DEFAULT_WATCHLIST: { from: CurrencyCode; to: CurrencyCode }[] = [
	{ from: 'USD', to: 'EUR' },
	{ from: 'USD', to: 'GBP' },
	{ from: 'EUR', to: 'GBP' },
	{ from: 'USD', to: 'JPY' },
	{ from: 'USD', to: 'CHF' },
	{ from: 'EUR', to: 'PLN' }
];

async function buildSeries(
	fetchFn: typeof fetch,
	from: CurrencyCode,
	to: CurrencyCode,
	startDate: string
): Promise<RateSeries | null> {
	try {
		const data = await fetchTimeseries(fetchFn, from, to, startDate);
		const points: RatePoint[] = Object.entries(data.rates)
			.map(([date, rates]) => ({ date, rate: rates[to] }))
			.filter((p) => Number.isFinite(p.rate))
			.sort((a, b) => a.date.localeCompare(b.date));

		if (points.length < 2) return null;

		const current = points[points.length - 1].rate;
		// ECB publishes on working days only; ~5 entries ≈ 1 week.
		const weekIdx = Math.max(0, points.length - 6);
		const weekAgo = points[weekIdx].rate;
		const changePct = ((current - weekAgo) / weekAgo) * 100;
		const values = points.map((p) => p.rate);

		return {
			from,
			to,
			current,
			weekAgo,
			changePct,
			low: Math.min(...values),
			high: Math.max(...values),
			points,
			asOf: points[points.length - 1].date
		};
	} catch {
		return null;
	}
}

export const load: PageServerLoad = async ({ fetch, setHeaders }) => {
	const startDate = isoDaysAgo(30);

	const series = await Promise.all(
		DEFAULT_WATCHLIST.map((p) => buildSeries(fetch, p.from, p.to, startDate))
	);

	setHeaders({
		'cache-control': 'public, max-age=900'
	});

	return {
		series: series.filter((s): s is RateSeries => s !== null)
	};
};
