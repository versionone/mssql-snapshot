module.exports = function (wallaby) {
    return {
        files: [
            'src/**/*.js',
            'test/databaseConfig.js',
            'test/fakeDb.js'
        ],
        tests: [
            'test/**/*spec.js'
        ],
        compilers: {
            '**/*.js': wallaby.compilers.babel()
        },
        env: {
            type: 'node'
        }
    };
};