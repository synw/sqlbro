import { createDbWorker, WorkerHttpvfs } from "sql.js-httpvfs";

let worker: WorkerHttpvfs;

let setDbReady: (value: boolean) => void;
let isDbReady = new Promise<boolean>((r) => setDbReady = r);

async function initDb(
  baseUrl = window.document.baseURI + "assets/",
  dbName = "db.sqlite",
) {
  worker = await createDbWorker(
    [
      {
        from: "inline",
        config: {
          serverMode: "full",
          url: baseUrl + dbName,
          requestChunkSize: 4096,
        },
      },
    ],
    baseUrl + "sqlite.worker.js",
    baseUrl + "sql-wasm.wasm"
  );
  setDbReady(true)
}

async function query<T = Array<Record<string, any>>>(q: string): Promise<T> {
  if (!worker) {
    console.warn("Waiting for db initialization before querying")
    await isDbReady;
  }
  return (await worker.db.query(q)) as T;
}

export { initDb, query, isDbReady }
