module.exports = function(wallaby) {
	return {
		files: [
			'src/**/*.js',
			'src/queries/**/*.sql',
			'test/testUtilities.js',
			'test/testHelper.js',
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
		},
		setup(w) {
			const path = require('path');
			require(path.join(w.localProjectDir,'test', 'testHelper'));
			var mocha = w.testFramework;
			mocha.timeout(10000);
		},
		workers: {
			initial: 1,
			regular: 1
		}
	};
};
