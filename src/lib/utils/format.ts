import type { CurrencyCode } from '$lib/types';

export function formatAmount(value: number, currency?: CurrencyCode): string {
	if (!Number.isFinite(value)) return '—';
	const opts: Intl.NumberFormatOptions = {
		minimumFractionDigits: 2,
		maximumFractionDigits: 2
	};
	if (currency === 'JPY' || currency === 'KRW' || currency === 'IDR') {
		opts.minimumFractionDigits = 0;
		opts.maximumFractionDigits = 0;
	}
	return new Intl.NumberFormat('en-US', opts).format(value);
}

export function formatRate(rate: number): string {
	if (!Number.isFinite(rate)) return '—';
	const digits = rate >= 100 ? 2 : rate >= 1 ? 4 : 6;
	return new Intl.NumberFormat('en-US', {
		minimumFractionDigits: digits,
		maximumFractionDigits: digits
	}).format(rate);
}

export function formatRateDate(iso: string): string {
	const d = new Date(iso + 'T00:00:00Z');
	return new Intl.DateTimeFormat('en-US', {
		month: 'short',
		day: 'numeric',
		year: 'numeric'
	}).format(d);
}

export function formatRelativeTime(timestamp: number): string {
	const diff = Date.now() - timestamp;
	const minutes = Math.floor(diff / 60_000);
	if (minutes < 1) return 'just now';
	if (minutes < 60) return `${minutes}m ago`;
	const hours = Math.floor(minutes / 60);
	if (hours < 24) return `${hours}h ago`;
	const days = Math.floor(hours / 24);
	if (days < 7) return `${days}d ago`;
	const d = new Date(timestamp);
	return new Intl.DateTimeFormat('en-US', {
		month: 'short',
		day: 'numeric'
	}).format(d);
}
