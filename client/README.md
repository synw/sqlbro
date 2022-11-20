# Sqlbro client

[![pub package](https://img.shields.io/npm/v/@sqlbro/client)](https://www.npmjs.com/package/@sqlbro/client)

A tiny wrapper around [sql.js-httpvfs](https://github.com/phiresky/sql.js-httpvfs) to query
read only public Sqlite databases from the browser:

```ts
import { initDb, query } from "@sqlbro/client";

await initDb("mydb.sqlite");
const data: Array<Record<string, any>> = await query(
  "SELECT * FROM mytable"
)
```

## Install

```bash
npm install @sqlbro/client
# or
yarn add @sqlbro/client
```

## Initialize the database

```ts
import { initDb } from "@sqlbro/client";

initDb()
```

Params and types:

```ts
function initDb(dbUrl?: string, workerUrl?: URL, wasmUrl?: URL): Promise<void>
```

Default values for the `initDb` params:

```ts
dbUrl = "db.sqlite",
workerUrl = new URL("/assets/sqlite.worker.js", import.meta.url),
wasmUrl = new URL("/assets/sql-wasm.wasm", import.meta.url)
```

- `workerUrl`: by default located in `/assets/sqlite.worker.js`
- `wasmUrl`: by default located in `/assets/sql-wasm.wasm`
- `dbUrl`: the url is relative to the location of the files above. By default located in `/assets/db.sqlite`

Example of initialization with different params:

```ts
import { initDb } from "@sqlbro/client";

initDb(
  "db/mydb.sqlite", // the db is in /static/db/mydb.sqlite
  workerUrl = new URL("/static/sqlite.worker.js", import.meta.url),
  wasmUrl = new URL("/static/sql-wasm.wasm", import.meta.url)
)
```

### Wait for the database initialization

Explicitly wait for the db to finish it's initialization:

```ts
import { isDbReady } from "@sqlbro/client";

await isDbReady;
console.log("The db is ready")
```

Note: the `query` function below will automatically wait for the
db initialization to complete before running a query. So it is safe
the run a query right after `initDb` not having to explicitly wait
for the db ready state

## Configure

:warning: These files have to be available from an url:

- `sqlite.worker.js`
- `sql-wasm.wasm`

Either copy them manualy from `node_modules/sql.js-httpvfs/dist/` to a static url location or use a bundler:

### Webpack

An [example for Webpack 5](https://github.com/phiresky/sql.js-httpvfs#usage) is available in
the [sql.js-httpvfs](https://github.com/phiresky/sql.js-httpvfs) repository

### Vitejs

Example to bundle the required files with Vitejs:

```bash
npm install --save-dev vite-plugin-static-copy
# or
yarn add -D vite-plugin-static-copy
```

Then in the `vite.config.ts` file:

```ts
import { defineConfig } from 'vite'
import { viteStaticCopy } from 'vite-plugin-static-copy'

export default defineConfig({
  assetsInclude: ['**/*.sqlite'],
  plugins: [
    // ...
    viteStaticCopy({
      targets: [
        {
          src: 'node_modules/sql.js-httpvfs/dist/sqlite.worker.js',
          dest: 'assets'
        },
        {
          src: 'node_modules/sql.js-httpvfs/dist/sql-wasm.wasm',
          dest: 'assets'
        },
        {
          src: 'src/assets/db.sqlite',
          dest: 'assets'
        }
      ]
    })
  ],
})
```

This will handle the files in dev mode and for the build

## Query

Query the database from the browser:

```ts
import { query } from "@sqlbro/client"

const data: Array<Record<string, any>> = await query(
  "SELECT * FROM mytable"
)
```

Typing:

```ts
function query<T = Array<Record<string, any>>>(q: string): Promise<T>
```

Example of a query the would return typed data:

```ts
interface Product {
  id: number;
  name: string;
  description: string;
}

const data: Array<Product> = await query(
  "SELECT id,name,description FROM products"
)
```