module.exports = function (wallaby) {
    return {
        files: [
            'src/**/*.js',
            'src/queries/**/*.sql',
            'test/testUtilities.js'
        ],
        tests: [
            'src/queries/**/*.sql',
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