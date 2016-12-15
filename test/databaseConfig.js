export default function() {
    return {
        user: 'user',
        password: 'pass',
        server: 'localhost',
        database: 'dbname',
        pool: {
            max: 10,
            min: 0,
            idleTimeoutMillis: 30000
        }
    }
}
