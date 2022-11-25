#!/usr/bin/env node
import { readJsonFile, initDb, db, execute, insertJson } from "@sqlbro/builder";
import { schemas } from "./schemas";

async function main() {
  const dbPath = __dirname + "/../../src/assets/db.sqlite";
  // remove the old database
  await execute("rm", ["-f", dbPath])
  console.log(dbPath);
  // initialize the new database
  initDb(dbPath, schemas);
  // load data from json
  const jsonData = await readJsonFile(__dirname + "/../data.json");
  // fill the category table
  insertJson("category", jsonData["categories"]);
  // grab the beers category id
  let sql = 'SELECT * from category WHERE slug="beers"';
  db.all(sql, [], (err, rows) => {
    if (err) {
      throw err;
    }
    const cid = rows[0].id;
    // fill the products table with beers data
    insertJson(
      "product",
      jsonData["beers"],
      true, // auto id
      (line) => {
        // append the category id
        line.push(cid)
        return line
      }
    );
  });
}

(async () => {
  try {
    await main();
  } catch (e) {
    throw e
  }
})();