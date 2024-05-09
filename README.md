# D1

## Local

```sh
  pnpm wrangler d1 execute d1-worker-toy --local --file=src/d1/schema.sql
```

```sh
  pnpm wrangler d1 execute d1-worker-toy --local --command="SELECT * FROM Customers"
```

## Remote

```sh
  pnpm wrangler d1 execute d1-worker-toy --remote --file=src/d1/schema.sql
```

```sh
  pnpm wrangler d1 execute d1-worker-toy --remote --command="SELECT * FROM Customers"
```

## Vitest

[@cloudflare/vitest-pool-workers 使用](https://developers.cloudflare.com/workers/testing/vitest-integration/get-started/migrate-from-unstable-dev/)