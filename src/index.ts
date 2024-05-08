/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `npm run dev` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npm run deploy` to publish your worker
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

import { Customer } from './types/customer';

export interface Env {
	MY_VARIABLE: string;

	// Example binding to KV. Learn more at https://developers.cloudflare.com/workers/runtime-apis/kv/
	MY_WORKER_TOY: KVNamespace;
	//
	// Example binding to R2. Learn more at https://developers.cloudflare.com/workers/runtime-apis/r2/
	MY_PICTURES_BUCKET: R2Bucket;
	//
	// Example binding to D1. Learn more at https://developers.cloudflare.com/d1/
	MY_WORKER_TOY_DB: D1Database;
	//
	// Example binding to Durable Object. Learn more at https://developers.cloudflare.com/workers/runtime-apis/durable-objects/
	// MY_DURABLE_OBJECT: DurableObjectNamespace;
	//
	// Example binding to a Service. Learn more at https://developers.cloudflare.com/workers/runtime-apis/service-bindings/
	// MY_SERVICE: Fetcher;
	//
	// Example binding to a Queue. Learn more at https://developers.cloudflare.com/queues/javascript-apis/
	// MY_QUEUE: Queue;
}

// addEventListener('fetch', (event) => {
// 	event.respondWith(new Response('hello world!!!'));
// });

const triggerHandler = async (controller: ScheduledController, env: Env) => {
	console.info(controller.cron, controller.scheduledTime, env);
};

export default {
	async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
		const url = new URL(request.url);
		console.info({ url: url.pathname });

		// ## Home (HTML + Enviroment Variable)
		if (url.pathname === '/') {
			return new Response(
				`
<html>
  <body>
    <h1>Hello World!</h1>
    <p>MY_VARIABLE: ${env.MY_VARIABLE}</p>
  </body>
</html>
      `,
				{
					headers: {
						'content-type': 'text/html',
					},
				}
			);
		}

		// ## JSON
		if (url.pathname === '/json') {
			return Response.json({ key: 'value' });
		}

		// ## KVNamesapce
		if (url.pathname.startsWith('/kv-list')) {
			const result = await env.MY_WORKER_TOY.list();
			const list = result;
			const response = Response.json({ list });
			return response;
		}
		if (url.pathname.startsWith('/kv')) {
			// KeyはQueryから取得
			const key = url.pathname.split('/').slice(2).join('/');
			switch (request.method) {
				case 'GET':
					// 第二引数で kv typeを指定可能
					const getResult = await env.MY_WORKER_TOY.get(key, { type: 'text' });
					return new Response(`KV Value ${key}:${getResult ?? 'null'}}`, { status: 200 });

				case 'POST':
					const fd = await request.formData();
					const value = fd.get('value') as string;
					if (key && value) {
						// kv の有効期限を設定可能
						await env.MY_WORKER_TOY.put(key, value, { expirationTtl: 60 });
						return new Response(`KV Upload Success! ${key}:${value}}`, { status: 200 });
					}
					break;

				case 'DELETE':
					if (key) {
						await env.MY_WORKER_TOY.delete(key);
						return new Response(`KV Delete Success! ${key}`, { status: 200 });
					}
					break;

				default:
					break;
			}
		}

		// ## R2 - Picture
		if (url.pathname.startsWith('/r2-list')) {
			const result = await env.MY_PICTURES_BUCKET.list();
			const list = result.objects.map((e) => ({ key: e.key, size: e.size }));
			return Response.json({ list });
		}
		if (url.pathname.startsWith('/r2')) {
			// KeyはQueryから取得
			const key = url.pathname.split('/').slice(2).join('/');
			console.info('key', key);

			switch (request.method) {
				case 'GET':
					// [Cache設定]
					// https://developers.cloudflare.com/workers/examples/cache-api/
					// @ts-ignore requestの型が合わない??
					const cacheKey = new Request(url.toString(), request);
					const cache = caches.default;
					let response = await cache.match(cacheKey);
					if (response) {
						console.log(`Cache hit for: ${request.url}.`);
						return response;
					}
					console.log(`Response for request url: ${request.url} not present in cache. Fetching and caching request.`);

					const object = await env.MY_PICTURES_BUCKET.get(key ?? '');
					if (object) {
						const headers = new Headers();
						object.writeHttpMetadata(headers);
						headers.set('etag', object.httpEtag);
						headers.set('Cache-Control', 'public, max-age=3600');

						response = new Response(object.body, { headers });

						ctx.waitUntil(cache.put(cacheKey, response.clone()));
						return response;
					}
					break;

				case 'PUT':
					if (request.body) {
						const result = await env.MY_PICTURES_BUCKET.put(key, request.body as ReadableStream<any>);
						return new Response(`Upload Success! ${result?.key} ${result?.size}}`, { status: 200 });
					}
					break;

				case 'POST':
					const fd = await request.formData();
					const pictures = fd.getAll('pictures').filter((e) => e instanceof File);

					if (pictures) {
						// const result = await env.MY_PICTURES_BUCKET.put(key, file);
						console.info({ pictures });

						await Promise.allSettled(
							pictures.map(async (picture) => {
								if (picture instanceof File) {
									const buffer = await picture.arrayBuffer();
									const result = await env.MY_PICTURES_BUCKET.put(picture.name, buffer);
									if (request) return result;
								}
								return null;
							})
						);
						const result = await env.MY_PICTURES_BUCKET.list();
						const list = result.objects.map((e) => ({ key: e.key, size: e.size }));
						return Response.json({ result: true, message: 'Upload Success!', list }, { status: 200 });
					}
					break;

				case 'DELETE':
					await env.MY_PICTURES_BUCKET.delete(key);
					return new Response('Delete Success!', { status: 200 });

				default:
					break;
			}
		}

		// ## D1
		if (url.pathname === '/d1') {
			switch (request.method) {
				case 'GET':
					const { results } = await env.MY_WORKER_TOY_DB.prepare('SELECT * FROM Customers').all<Customer>();
					return Response.json({ list: results });

				default:
			}
		}

		return new Response('Not Found', { status: 404 });
	},
	async scheduled(controller: ScheduledController, env: Env, ctx: ExecutionContext) {
		ctx.waitUntil(triggerHandler(controller, env));
	},
};
