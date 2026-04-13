import { writable } from 'svelte/store';

export type User = {
  email: string;
  token?: string;
  name?: string;
};

export const session = writable<User | null>(null);