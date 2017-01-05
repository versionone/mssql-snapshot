export default function() {
    return {
        user: 'pub',
        password: 'pub',
        server: 'localhost',
        database: 'V1Demo',
        pool: {
            max: 10,
            min: 0,
            idleTimeoutMillis: 30000
        }
    }
}
