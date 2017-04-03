module.exports = function(wallaby) {
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
		},
		setup(wallaby) {
			var chaiAsPromised = require('chai-as-promised');
			chai.should();
			chai.use(chaiAsPromised);
			var mocha = wallaby.testFramework;
			mocha.timeout(10000);
		},
		workers: {
			initial: 1,
			regular: 1
		}
	};
};
