import type { Currency, CurrencyCode } from '$lib/types';

export const currencies: Currency[] = [
	{ code: 'USD', name: 'US Dollar', symbol: '$', flag: '🇺🇸' },
	{ code: 'EUR', name: 'Euro', symbol: '€', flag: '🇪🇺' },
	{ code: 'GBP', name: 'British Pound', symbol: '£', flag: '🇬🇧' },
	{ code: 'JPY', name: 'Japanese Yen', symbol: '¥', flag: '🇯🇵' },
	{ code: 'CHF', name: 'Swiss Franc', symbol: 'Fr', flag: '🇨🇭' },
	{ code: 'CAD', name: 'Canadian Dollar', symbol: 'C$', flag: '🇨🇦' },
	{ code: 'AUD', name: 'Australian Dollar', symbol: 'A$', flag: '🇦🇺' },
	{ code: 'NZD', name: 'New Zealand Dollar', symbol: 'NZ$', flag: '🇳🇿' },
	{ code: 'CNY', name: 'Chinese Yuan', symbol: '¥', flag: '🇨🇳' },
	{ code: 'HKD', name: 'Hong Kong Dollar', symbol: 'HK$', flag: '🇭🇰' },
	{ code: 'SGD', name: 'Singapore Dollar', symbol: 'S$', flag: '🇸🇬' },
	{ code: 'KRW', name: 'South Korean Won', symbol: '₩', flag: '🇰🇷' },
	{ code: 'INR', name: 'Indian Rupee', symbol: '₹', flag: '🇮🇳' },
	{ code: 'IDR', name: 'Indonesian Rupiah', symbol: 'Rp', flag: '🇮🇩' },
	{ code: 'THB', name: 'Thai Baht', symbol: '฿', flag: '🇹🇭' },
	{ code: 'MYR', name: 'Malaysian Ringgit', symbol: 'RM', flag: '🇲🇾' },
	{ code: 'PHP', name: 'Philippine Peso', symbol: '₱', flag: '🇵🇭' },
	{ code: 'PLN', name: 'Polish Złoty', symbol: 'zł', flag: '🇵🇱' },
	{ code: 'CZK', name: 'Czech Koruna', symbol: 'Kč', flag: '🇨🇿' },
	{ code: 'HUF', name: 'Hungarian Forint', symbol: 'Ft', flag: '🇭🇺' },
	{ code: 'RON', name: 'Romanian Leu', symbol: 'lei', flag: '🇷🇴' },
	{ code: 'BGN', name: 'Bulgarian Lev', symbol: 'лв', flag: '🇧🇬' },
	{ code: 'SEK', name: 'Swedish Krona', symbol: 'kr', flag: '🇸🇪' },
	{ code: 'NOK', name: 'Norwegian Krone', symbol: 'kr', flag: '🇳🇴' },
	{ code: 'DKK', name: 'Danish Krone', symbol: 'kr', flag: '🇩🇰' },
	{ code: 'ISK', name: 'Icelandic Króna', symbol: 'kr', flag: '🇮🇸' },
	{ code: 'TRY', name: 'Turkish Lira', symbol: '₺', flag: '🇹🇷' },
	{ code: 'ILS', name: 'Israeli Shekel', symbol: '₪', flag: '🇮🇱' },
	{ code: 'ZAR', name: 'South African Rand', symbol: 'R', flag: '🇿🇦' },
	{ code: 'MXN', name: 'Mexican Peso', symbol: 'MX$', flag: '🇲🇽' },
	{ code: 'BRL', name: 'Brazilian Real', symbol: 'R$', flag: '🇧🇷' }
];

const byCode = new Map(currencies.map((c) => [c.code, c]));

export function getCurrency(code: CurrencyCode): Currency | undefined {
	return byCode.get(code);
}

export const popularCodes: CurrencyCode[] = [
	'USD',
	'EUR',
	'GBP',
	'JPY',
	'CHF',
	'CAD',
	'AUD',
	'PLN'
];
