declare let isDbReady: Promise<boolean>;
declare function initDb(baseUrl?: string, dbName?: string): Promise<void>;
declare function query<T>(q: string): Promise<T>;
export { initDb, query, isDbReady };
