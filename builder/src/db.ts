import DatabaseConstructor, { Database } from "better-sqlite3";


let db: Database = new DatabaseConstructor("");
let setDbReady: (value: boolean) => void;
let isDbReady = new Promise<boolean>((r) => setDbReady = r);

function initDb(path: string, schemas: Array<string>, verbose = true) {
  const opts = verbose ? { verbose: console.log } : {};
  db = new DatabaseConstructor(path, opts);
  schemas.forEach((s) => db.exec(s));
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
            line.push(`'${_c}'`)
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
  const q = `INSERT INTO ${table} VALUES ${rows.join(',\n')}`;
  console.log("Q", q);
  //const stmt = db.prepare(q)
  //stmt.run();
  db.exec(q)
  console.log("OK, database built")
}

export { db, initDb, insertJson, isDbReady }
