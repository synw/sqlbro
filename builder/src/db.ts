import type { Database } from "sqlite3";
const sqlite3 = require('sqlite3').verbose();


let db: Database;
let setDbReady: (value: boolean) => void;
let isDbReady = new Promise<boolean>((r) => setDbReady = r);

function initDb(path: string, schemas: Array<string>) {
  db = new sqlite3.Database(path);
  db.serialize(() => {
    schemas.forEach((s) => {
      db.run(s)
    })
  });
  setDbReady(true)
}

function insertJson(
  table: string,
  data: Array<Record<string, any>>,
  autoId = false,
  transform?: (row: Array<string | number>) => Array<string | number>
) {
  const rows = new Array<string>();
  let i = 1;
  data.forEach((row) => {
    let line = new Array<string | number>();
    if (autoId) {
      line.push(i)
    }
    Object.values(row).forEach((_c) => {
      if (!_c) {
        line.push("NULL")
      } else {
        //console.log(typeof _c)
        switch (typeof _c) {
          case "object":
            line.push(`'${JSON.stringify(_c)}'`)
            break;
          case "number":
            line.push(_c)
            break;
          default:
            line.push(`"${_c}"`)
            break;
        }
      }
    });
    if (transform) {
      line = transform(line)
    }
    rows.push('(' + line.join() + ')')
    ++i;
    //console.log("ROW", line)
  });
  const q = `INSERT INTO ${table} VALUES 
${rows.join(',\n')}`;
  console.log("Q", q);
  db.exec(q);
  console.log("OK, database built")
}

export { db, initDb, insertJson, isDbReady }
