export type CurrencyCode = string;

export interface Currency {
	code: CurrencyCode;
	name: string;
	symbol: string;
	flag: string;
}

export interface RatesResponse {
	base: CurrencyCode;
	date: string;
	rates: Record<CurrencyCode, number>;
}

export interface Conversion {
	id: string;
	from: CurrencyCode;
	to: CurrencyCode;
	amount: number;
	result: number;
	rate: number;
	date: string;
	savedAt: number;
}

export interface Contact {
	id: string;
	name: string;
	email?: string;
	preferredCurrency: CurrencyCode;
	notes?: string;
	createdAt: number;
}

export interface RatePoint {
	date: string;
	rate: number;
}

export interface RateSeries {
	from: CurrencyCode;
	to: CurrencyCode;
	current: number;
	weekAgo: number;
	changePct: number;
	low: number;
	high: number;
	points: RatePoint[];
	asOf: string;
}

export interface TimeseriesResponse {
	amount: number;
	base: CurrencyCode;
	start_date: string;
	end_date: string;
	rates: Record<string, Record<CurrencyCode, number>>;
}
