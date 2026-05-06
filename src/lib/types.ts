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
