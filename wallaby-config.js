module.exports = function (wallaby) {
    return {
        files: [
            'src/**/*.js'
        ],
        tests: [
            'src/test/**/*Spec.js'
        ],
        compilers: {
            '**/*.js': wallaby.compilers.babel()
        }
    };
};