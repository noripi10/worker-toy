# Wrangler Summary

## Secrets - Enviroment Variable

[Document](https://developers.cloudflare.com/workers/configuration/secrets/)

```sh
pnpm wrangler secret put <KEY>
pnpm wrangler secret put <KEY> --env production

pnpm wrangler secret delete <KEY>
pnpm wrangler secret put <KEY> --env production
```

```sh
pnpm wrangler secret -h
wrangler secret

�💡 Generate a secret that can be referenced in a Worker

Commands:
  wrangler secret put <key>     Create or update a secret variable for a Worker
  wrangler secret delete <key>  Delete a secret variable from a Worker
  wrangler secret list          List all secrets for a Worker

Flags:
  -j, --experimental-json-config  Experimental: Support wrangler.json  [boolean]
  -c, --config                    Path to .toml configuration file  [string]
  -e, --env                       Environment to use for operations and .env files  [string]
  -h, --help                      Show help  [boolean]
  -v, --version                   Show version number  [boolean]
```

```toml
[vars]
MY_VARIABLE = "development_value"
[env.production.vars]
MY_VARIABLE = "production_value"
```

## KV

[Document](https://developers.cloudflare.com/kv/get-started/)

```sh
pnpm wrangler kv:namespace create <YOUR_NAMESPACE>

pnpm wrangler kv:namespace list

pnpm wrangler kv:namespace delete [...options]
```

```sh
kv:namespace -h
wrangler kv:namespace

🌀️  Interact with your Workers KV Namespaces

Commands:
  wrangler kv:namespace create <namespace>  Create a new namespace
  wrangler kv:namespace list                Outputs a list of all KV namespaces associated with your account id.
  wrangler kv:namespace delete              Deletes a given namespace.

Flags:
  -j, --experimental-json-config  Experimental: Support wrangler.json  [boolean]
  -c, --config                    Path to .toml configuration file  [string]
  -e, --env                       Environment to use for operations and .env files  [string]
  -h, --help                      Show help  [boolean]
  -v, --version                   Show version number  [boolean]
```

```toml
  [[kv_namespaces]]
  binding = "MY_WORKER_TOY"
  id = "bee798b9e6d041a3b0f32918809d4a48"
  preview_id = "bee798b9e6d041a3b0f32918809d4a48"
  [[env.production.kv_namespaces]]
  binding = "MY_WORKER_TOY"
  id = "bee798b9e6d041a3b0f32918809d4a48"
```

## R2

[Document](https://developers.cloudflare.com/r2/api/workers/workers-api-usage/)

```sh
pnpm wrangler r2 bucket create <YOUR_BUCKET_NAME>

pnpm wrangler r2 bucket list

pnpm wrangler kv:namespace delete [...options]

pnpm wrangler r2 bucket -h
wrangler r2 bucket

Manage R2 buckets

Commands:
  wrangler r2 bucket create <name>  Create a new R2 bucket
  wrangler r2 bucket update         Update bucket state
  wrangler r2 bucket list           List R2 buckets
  wrangler r2 bucket delete <name>  Delete an R2 bucket
  wrangler r2 bucket sippy          Manage Sippy incremental migration on an R2 bucket
  wrangler r2 bucket notification   Manage event notifications for an R2 bucket

Flags:
  -j, --experimental-json-config  Experimental: Support wrangler.json  [boolean]
  -c, --config                    Path to .toml configuration file  [string]
  -e, --env                       Environment to use for operations and .env files  [string]
  -h, --help                      Show help  [boolean]
  -v, --version                   Show version number  [boolean]
```

```toml
  [[r2_buckets]]
  binding = "MY_PICTURES_BUCKET"
  bucket_name = "pictures"
  preview_bucket_name  = "pictures"
  [[env.production.r2_buckets]]
  binding = "MY_PICTURES_BUCKET"
  bucket_name = "pictures"
  preview_bucket_name  = "pictures"
```

## D1 (DB 作成)

[Document](https://developers.cloudflare.com/d1/get-started/)

### Local

```sh
  pnpm wrangler d1 execute d1-worker-toy --local --file=src/d1/schema.sql
```

```sh
  pnpm wrangler d1 execute d1-worker-toy --local --command="SELECT * FROM Customers"
```

### Remote

```sh
  pnpm wrangler d1 execute d1-worker-toy --remote --file=src/d1/schema.sql
```

```sh
  pnpm wrangler d1 execute d1-worker-toy --remote --command="SELECT * FROM Customers"
```

```sh
pnpm wrangler d1 -h
wrangler d1

🗄  Interact with a D1 database

Commands:
  wrangler d1 list                List D1 databases
  wrangler d1 info <name>         Get information about a D1 database, including the current database size and state.
  wrangler d1 insights <name>     Experimental command. Get information about the queries run on a D1 database.
  wrangler d1 create <name>       Create D1 database
  wrangler d1 delete <name>       Delete D1 database
  wrangler d1 backup              Interact with D1 Backups
  wrangler d1 execute <database>  Executed command or SQL file
  wrangler d1 export <name>       Export the contents or schema of your database as a .sql file
  wrangler d1 time-travel         Use Time Travel to restore, fork or copy a database at a specific point-in-time.
  wrangler d1 migrations          Interact with D1 Migrations

Flags:
  -j, --experimental-json-config  Experimental: Support wrangler.json  [boolean]
  -c, --config                    Path to .toml configuration file  [string]
  -e, --env                       Environment to use for operations and .env files  [string]
  -h, --help                      Show help  [boolean]
  -v, --version                   Show version number  [boolean]
```

```toml
  [[d1_databases]]
  binding = "MY_WORKER_TOY_DB" # i.e. available in your Worker on env.DB
  database_name = "d1-worker-toy"
  database_id = "4952de3f-41b0-4c40-a4c5-52876a5139c3"
  [[env.production.d1_databases]]
  binding = "MY_WORKER_TOY_DB" # i.e. available in your Worker on env.DB
  database_name = "d1-worker-toy"
  database_id = "4952de3f-41b0-4c40-a4c5-52876a5139c3"
```

### D1 + Prisma

[Query D1 using Prisma ORM](https://developers.cloudflare.com/d1/tutorials/d1-and-prisma-orm/)

1. DB 作成 ↑
2. Prisma 設定
3. D1 マイグレーション内容記述

   - wrangler コマンドでマイグレーションファイルを作成
   - schema.prisma に model 内容を記述
   - schema.prisma ファイルの変更内容を prisma コマンドで wrangler マイグレーションファイルに反映

4. D1 マイグレーション適用

#### マイグレーションのやり方

```sh
# 初回
npx wrangler d1 migrations create d1-worker-toy create_customers_table

# shema.prisma にモデルを記述したら以下を実行すると0001_create_customers_table.sqlに反映される
npx prisma migrate diff --from-empty --to-schema-datamodel ./prisma/schema.prisma --script > migrations/0001_create_customers_table.sql

# マイグレーション内容をDBに反映させる
npx wrangler d1 migrations apply d1-worker-toy --local
npx wrangler d1 migrations apply d1-worker-toy --remote

# prisma clientを作成
npx prisma generate


# テーブル構造を変更したりテーブル作成したいばあいは schema.prismaを編集し以下を実行
npx wrangler d1 migrations create d1-worker-toy add_columns_customers
npx prisma migrate diff --from-local-d1 --to-schema-datamodel ./prisma/schema.prisma --script > migrations/0002_add_columns_customers.sql
npx wrangler d1 migrations apply d1-worker-toy --local
npx wrangler d1 migrations apply d1-worker-toy --remote
npx prisma generate
```

## Vitest

[@cloudflare/vitest-pool-workers 使用](https://developers.cloudflare.com/workers/testing/vitest-integration/get-started/migrate-from-unstable-dev/)

- tsconfig.json に types を指定して型補完

```json
"types": [
  "@cloudflare/workers-types",
  "@cloudflare/workers-types/experimental",
  "@cloudflare/vitest-pool-workers",
  "vitest/globals"
]
```

```typscript
// SELF を使用する
import { SELF } from 'cloudflare:test';
```

- D1 テスト

[Document](https://developers.cloudflare.com/workers/testing/vitest-integration/get-started/write-your-first-test)

[Examples](https://github.com/cloudflare/workers-sdk/tree/main/fixtures/vitest-pool-workers-examples)

vitest@1.5.0 を指定

- マイグレーションファイルを作成

```sh
pnpm wrangler d1 migrations create d1-worker-toy init
```

- vitest.config.ts で migrations を環境変数にバインド (miniflare を使う)
- test/env.d.ts で ProvidedEnv の型情報に Env を拡張する
- test/tsconfig.json を作成し types を設定
- beforeEach 処理内で applyD1Migrations でテスト用にマイグレーションを実行。またはセットアップファイル(vite.config.ts で指定)内で実行する
- テスト実行
