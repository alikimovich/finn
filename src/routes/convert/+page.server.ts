import type { PageServerLoad } from './$types';
import { fetchLatestRates } from '$lib/server/frankfurter';

export const load: PageServerLoad = async ({ fetch, setHeaders }) => {
	const rates = await fetchLatestRates(fetch, 'EUR');

	setHeaders({
		'cache-control': 'public, max-age=900'
	});

	return {
		base: rates.base,
		date: rates.date,
		rates: rates.rates
	};
};
