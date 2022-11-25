const schemas = [`CREATE TABLE "category" (
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

export { schemas }