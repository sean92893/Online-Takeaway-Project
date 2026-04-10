// place files you want to import through the `$lib` alias in this folder.
import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import { DATABASE_URL } from '$env/static/private';

const sqlite = new Database(DATABASE_URL.replace('file:', ''));
export const db = drizzle(sqlite);