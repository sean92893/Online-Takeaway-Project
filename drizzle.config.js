import { defineConfig } from 'drizzle-kit';

export default defineConfig({
	schema: './src/lib/server/db/schema.js',
	dialect: 'sqlite',
	dbCredentials: {
		url: 'file:./database.db'
	},
	verbose: true,
	strict: true
});