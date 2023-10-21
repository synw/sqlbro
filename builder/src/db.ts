import { Database } from "better-sqlite3";


class DbBuilder {
  db: Database;
  _isDbReady = false;
  _isVerbose = true;

  constructor(db: Database, verbose = true) {
    this.db = db;
    this._isVerbose = verbose;
  }

  get isDbReady(): boolean {
    return this._isDbReady
  }

  init(schemas: Array<string>): DbBuilder {
    schemas.forEach((s) => {
      this.db.exec(s);
      if (this._isVerbose) {
        console.log(`Schema executed: ${s}`)
      }
    });
    this._isDbReady = true;
    return this
  }

  insertJson(
    table: string,
    data: Array<Record<string, any>>,
    autoId = false,
    transform?: (row: Array<string | number>) => Array<string | number>
  ): DbBuilder {
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
    this.db.exec(q)
    console.log("OK, database built")
    return this
  }
}


export { DbBuilder }
