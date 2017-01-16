module.exports = function (wallaby) {
    return {
        files: [
            'src/**/*.js',
            'src/queries/**/*.sql'
        ],
        tests: [
            'test/**/*spec.js',
            'test/testUtilities.js'
        ],
        compilers: {
            '**/*.js': wallaby.compilers.babel()
        },
        env: {
            type: 'node'
        }
    };
};