export default function(fakeDb) {
    return {
        isUnitTest: true, //value should equal false to run integration tests using the connection inforamtion below
        fakeDb: fakeDb,
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
