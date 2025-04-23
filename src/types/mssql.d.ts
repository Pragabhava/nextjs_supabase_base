declare module 'mssql' {
    export interface config {
        connectionString?: string;
        server?: string;
        port?: number;
        user?: string;
        password?: string;
        database?: string;
        options?: {
            encrypt?: boolean;
            trustServerCertificate?: boolean;
        };
    }

    export class ConnectionPool {
        constructor(config: config);
        connect(): Promise<ConnectionPool>;
        request(): Request;
        close(): Promise<void>;
    }

    export class Request {
        input(name: string, value: any): Request;
        query(command: string): Promise<{ recordset: any[] }>;
    }
} 