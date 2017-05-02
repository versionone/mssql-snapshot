export default function() {
    return {
        name: 'mssql-snapshot-default',
        user: 'mssqlTestUser',
        password: ',y#&$p2rYQ8VR?}&',
        server: 'localhost',
        database: 'mssql-snapshot-testdb',
        pool: {
            max: 10,
            min: 0,
            idleTimeoutMillis: 30000
        }
    }
}
