declare let isDbReady: Promise<boolean>;
declare function initDb(dbUrl?: string, workerUrl?: URL, wasmUrl?: URL): Promise<void>;
declare function query<T>(q: string): Promise<T>;
export { initDb, query, isDbReady };
