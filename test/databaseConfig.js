export default function(fakeDb) {
    return {
        isUnitTest: true, //value should equal false to run integration tests using the connection inforamtion below
        fakeDb: fakeDb, //unit tests should expect a fake database object with mocked props to pass the tests and match the api
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
