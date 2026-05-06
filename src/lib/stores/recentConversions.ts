import { writable } from 'svelte/store';
import { browser } from '$app/environment';
import type { Conversion } from '$lib/types';

const STORAGE_KEY = 'finn:recent-conversions';
const MAX_ENTRIES = 10;

function loadInitial(): Conversion[] {
	if (!browser) return [];
	try {
		const raw = localStorage.getItem(STORAGE_KEY);
		if (!raw) return [];
		const parsed = JSON.parse(raw);
		return Array.isArray(parsed) ? parsed : [];
	} catch {
		return [];
	}
}

function createStore() {
	const store = writable<Conversion[]>(loadInitial());

	if (browser) {
		store.subscribe((value) => {
			try {
				localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
			} catch {
				// quota exceeded or storage disabled — ignore
			}
		});
	}

	return {
		subscribe: store.subscribe,
		add(entry: Omit<Conversion, 'id' | 'savedAt'>) {
			store.update((list) => {
				const next: Conversion = {
					...entry,
					id: crypto.randomUUID(),
					savedAt: Date.now()
				};
				return [next, ...list].slice(0, MAX_ENTRIES);
			});
		},
		clear() {
			store.set([]);
		}
	};
}

export const recentConversions = createStore();
