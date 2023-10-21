#!/usr/bin/env node
import { readJsonFile, DbBuilder, execute } from "../../../builder/src/index";
import DatabaseConstructor from "better-sqlite3";
import { schemas } from "./schemas";

async function main() {
  const dbPath = __dirname + "/../../src/assets/db.sqlite";
  // remove the old database
  await execute("rm", ["-f", dbPath]);
  const db = new DatabaseConstructor(dbPath);
  const builder = new DbBuilder(db).init(schemas);
  console.log(dbPath);
  // load data from json
  const jsonData = readJsonFile(__dirname + "/../data.json");
  // fill the category table
  builder.insertJson("category", jsonData["categories"]);
  console.log("Categories created")
  // grab the beers category id
  let sql = "SELECT * from category WHERE slug='beers'";
  const stmt = db.prepare(sql);
  const rows = stmt.all() as Array<Record<string, any>>;
  const cid = rows[0].id;
  // fill the products table with beers data
  builder.insertJson(
    "product",
    jsonData["beers"],
    true, // auto id
    (line) => {
      // append the category id
      line.push(cid)
      return line
    }
  );
}

(async () => {
  try {
    await main();
  } catch (e) {
    throw e
  }
})();