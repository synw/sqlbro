declare let isDbReady: Promise<boolean>;
declare function initDb(baseUrl?: string, dbName?: string): Promise<void>;
declare function initDbConfig(baseUrl?: string, fileName?: string): Promise<void>;
declare function query<T>(q: string): Promise<T>;
export { initDb, initDbConfig, query, isDbReady };
