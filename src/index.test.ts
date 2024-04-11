import { SELF } from 'cloudflare:test';
import { expect, describe, test } from 'vitest';
import '.';

describe('Worker', () => {
	test('should return Hello World', async () => {
		const response = await SELF.fetch('http://example.com/');

		if (response) {
			expect(response.status).toBe(200);
			const text = await response.text();
			expect(text).toMatchInlineSnapshot(`"Hello World!"`);
		}
	});

	test('should return Not Found', async () => {
		const response = await SELF.fetch('http://example.com/404');

		if (response) {
			expect(response.status).toBe(404);
			const text = await response.text();
			expect(text).toMatchInlineSnapshot(`"Not Found"`);
		}
	});

	test('should return Json', async () => {
		const response = await SELF.fetch('http://example.com/json');

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
