module.exports = function (wallaby) {
    return {
        files: [
            'src/**/*.js'
        ],
        tests: [
            'src/test/**/*spec.js'
        ],
        compilers: {
            '**/*.js': wallaby.compilers.babel({presets: ["es2015"]})
        }
    };
};