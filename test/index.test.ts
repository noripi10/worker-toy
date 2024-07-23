import { Customer } from './../src/types/customer';
import { env, createExecutionContext, waitOnExecutionContext, SELF, applyD1Migrations } from 'cloudflare:test';
import { describe, test, expect, afterAll, beforeEach } from 'vitest';

describe('Databese Query (D1)', () => {
	beforeEach(async () => {
		await applyD1Migrations(env.MY_WORKER_TOY_DB, env.TEST_MIGRATIONS);
	});

	test('should execute a query and return results', async () => {
		await env.MY_WORKER_TOY_DB.prepare(
			`
      INSERT INTO
      Customers (CustomerID, CompanyName, ContactName)
      VALUES
      (1, 'Alfreds Futterkiste', 'Maria Anders'),
      (4, 'Around the Horn', 'Thomas Hardy'),
      (11, 'Bs Beverages', 'Victoria Ashworth'),
      (13, 'Bs Beverages', 'Random Name');
    `
		).run();

		await env.MY_WORKER_TOY_DB.prepare(
			`
		    INSERT INTO Customers VALUES (?1, ?2, ?3)
		  `
		)
			.bind(100, 'hoge', 'fuga')
			.run();

		const result = await env.MY_WORKER_TOY_DB.prepare('SELECT * FROM Customers').all<Customer>();
		expect(result.success).toBe(true);
		expect(result.results.length).toBe(5);
	});
});

describe('Worker', () => {
	test('should return Hello World', async () => {
		const response = await SELF.fetch('http://example.com/');
		expect(response.status).toBe(200);

		const text = await response.text();
		expect(text).toContain(`Hello World!`);
		expect(text).toContain('production');
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
