import { writable } from 'svelte/store';
import { browser } from '$app/environment';
import type { Contact } from '$lib/types';

const STORAGE_KEY = 'finn:contacts';

function loadInitial(): Contact[] {
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
	const store = writable<Contact[]>(loadInitial());

	if (browser) {
		store.subscribe((value) => {
			try {
				localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
			} catch {
				// ignore quota errors
			}
		});
	}

	return {
		subscribe: store.subscribe,
		add(entry: Omit<Contact, 'id' | 'createdAt'>) {
			store.update((list) => [
				{ ...entry, id: crypto.randomUUID(), createdAt: Date.now() },
				...list
			]);
		},
		update(id: string, patch: Partial<Omit<Contact, 'id' | 'createdAt'>>) {
			store.update((list) => list.map((c) => (c.id === id ? { ...c, ...patch } : c)));
		},
		remove(id: string) {
			store.update((list) => list.filter((c) => c.id !== id));
		},
		clear() {
			store.set([]);
		}
	};
}

export const contacts = createStore();
