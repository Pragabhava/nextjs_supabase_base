import sql from 'mssql'

// Cache the connection
let cachedConnection: sql.ConnectionPool | null = null

export async function createMssqlClient(db: string) {
    // Use cached connection if available
    if (cachedConnection) {
        return cachedConnection
    }

    // Configure the connection
    const config: sql.config = {
        connectionString: process.env[`NEXT_${db}_DB_URL`],
        options: {
            encrypt: true, // For Azure
            trustServerCertificate: true, // Change to false for production
        }
    }

    try {
        // Create new connection
        const pool = new sql.ConnectionPool(config)
        cachedConnection = await pool.connect()
        return cachedConnection
    } catch (error) {
        console.error('SQL Connection Error:', error)
        throw error
    }
}

// Example query function
export async function queryMssql<T>(
    query: string,
    params: Array<string | number | boolean | Date | Buffer | null> = [],
    db: string
): Promise<T[]> {
    const pool = await createMssqlClient(db)
    try {
        const request = pool.request()

        // Add parameters if any
        params.forEach((param, index) => {
            request.input(`p${index}`, param)
        })

        const result = await request.query(query)
        return result.recordset as T[]
    } catch (error) {
        console.error('SQL Query Error:', error)
        throw error
    }
}
