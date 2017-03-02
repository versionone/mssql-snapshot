module.exports = function (wallaby) {
    return {
        files: [
            'src/**/*.js',
            'src/queries/**/*.sql',
            'test/testUtilities.js'
        ],
        tests: [
            'test/**/*spec.js'
        ],
        compilers: {
            '**/*.js': wallaby.compilers.babel()
        },
        env: {
            type: 'node'
        },
        delays: {
            run: 3000
        }
    };
};