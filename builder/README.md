# Sqlbro builder

[![pub package](https://img.shields.io/npm/v/@sqlbro/builder)](https://www.npmjs.com/package/@sqlbro/builder)

Tooling to quickly prototype Sqlite databases in Nodejs

## Install

```bash
npm install @sqlbro/builder
```

## Usage

### Initialize the db

Define a database schema:

```ts
const schemas = [
  `CREATE TABLE "category" (
  "id" INTEGER PRIMARY KEY AUTOINCREMENT,
  "name" TEXT NOT NULL,
  "slug" TEXT NOT NULL UNIQUE,
  "icon" TEXT NOT NULL,
  "parent_id" INTEGER,
  FOREIGN KEY(parent_id) REFERENCES category(id)
)`,
  `CREATE TABLE "product" (
  "id" INTEGER PRIMARY KEY AUTOINCREMENT,
  "name" TEXT NOT NULL UNIQUE,
  "description"	TEXT NOT NULL,
  "props"	TEXT DEFAULT '{}',
  "category_id" INTEGER NOT NULL,
  FOREIGN KEY(category_id) REFERENCES category(id)
)`];
```

Initialize the database:

```ts
import DatabaseConstructor from "better-sqlite3";
import { readJsonFile, DbBuilder, execute } from "@sqlbro/builder";

const dbPath = "/some/path/db.sqlite";
const db = new DatabaseConstructor(dbPath);
const builder = new DbBuilder(db).init(schemas);
```

### Insert data

Read a json file:

```ts
import { readJsonFile } from "@sqlbro/builder";

const jsonData = await readJsonFile(__dirname + "/data.json");
```

Insert into the database from the json data:

```ts
builder.insertJson("category", jsonData["categories"]);
```

This will parse the json and convert the rows to an insert query. Possible data types:

- `string`: for TEXT fields
- `number`: for INTEGER or REAL fields
- `object`: any json array or object. Will be parsed into a TEXT field

Example json:

```json
[
  {
    "id": 37,
    "name": "item",
    "props": {
      "foo": "bar"
    }
  }
]
```

Will be transformed into:

```sql
INSERT INTO mytable VALUES (37, "item", '{"foo": "bar"}')
```

## Example

An [example](https://github.com/synw/sqlbro/tree/main/example/db) is available

