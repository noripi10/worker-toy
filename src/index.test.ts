import { UnstableDevWorker, unstable_dev } from 'wrangler';

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
			const text = await response.text();
			expect(text).toMatchInlineSnapshot(`"Hello World!"`);
		}
	});
});
