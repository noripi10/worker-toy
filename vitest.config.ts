import path from 'node:path';
import { defineWorkersConfig, defineWorkersProject, readD1Migrations } from '@cloudflare/vitest-pool-workers/config';

export default defineWorkersProject(async () => {
	const migrationsPath = path.join(__dirname, 'migrations');
	const migrations = await readD1Migrations(migrationsPath);

	return {
		test: {
			// setupFiles:[],
			poolOptions: {
				workers: {
					main: './src/index.ts',
					singleWorker: true,
					wrangler: {
						configPath: './wrangler.toml',
						environment: 'production',
					},
					miniflare: {
						bindings: { TEST_MIGRATIONS: migrations },
					},
				},
			},
		},
	};
});
