process.env.NODE_ENV = 'test';

module.exports = function (wallaby) {
	return {
		files: [
			'src/**/*.js',
			'test/testUtilities.js',
			'test-setup/testHelper.js',
		],
		tests: [
			'test-unit/**/*spec.js',
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
			require(path.join(w.localProjectDir, 'test-setup', 'testHelper'));
			w.testFramework.ui('bdd');
		},
	};
};
