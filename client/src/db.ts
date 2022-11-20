import { createDbWorker, WorkerHttpvfs } from "sql.js-httpvfs";

let worker: WorkerHttpvfs;

let setDbReady: (value: boolean) => void;
let isDbReady = new Promise<boolean>((r) => setDbReady = r);

async function initDb(
  dbUrl = "db.sqlite",
  workerUrl = new URL("/assets/sqlite.worker.js", import.meta.url),
  wasmUrl = new URL("/assets/sql-wasm.wasm", import.meta.url)
) {
  worker = await createDbWorker(
    [
      {
        from: "inline",
        config: {
          serverMode: "full",
          url: dbUrl,
          requestChunkSize: 4096,
        },
      },
    ],
    workerUrl.toString(),
    wasmUrl.toString()
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
