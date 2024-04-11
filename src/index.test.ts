import { UnstableDevWorker, unstable_dev } from 'wrangler';
import { describe, test } from 'vitest';

describe('Worker', () => {
	let worker: UnstableDevWorker;

	beforeAll(async () => {
		worker = await unstable_dev('src/index.ts', {
			experimental: { disableExperimentalWarning: true },
		});
	});

	afterAll(async () => {
		await worker.stop();
	});

	test('should return Hello World', async () => {
		const response = await worker.fetch();

		if (response) {
			expect(response.status).toBe(200);
			const text = await response.text();
			expect(text).toMatchInlineSnapshot(`"Hello World!"`);
		}
	});

	test('should return Not Found', async () => {
		const response = await worker.fetch('/404');

		if (response) {
			expect(response.status).toBe(404);
			const text = await response.text();
			expect(text).toMatchInlineSnapshot(`"Not Found"`);
		}
	});

	test('should return Json', async () => {
		const response = await worker.fetch('/json');

		if (response) {
			expect(response.status).toBe(200);
			const json = await response.json();
			console.info({ json });
			expect(json).toMatchObject({
				key: 'value',
			});
		}
	});
});
