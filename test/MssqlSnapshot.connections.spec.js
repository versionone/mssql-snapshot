import dbConfig from '../src/databaseConfig';
import MssqlSnapshot from '../src/MssqlSnapshot';
import * as utility from './testUtilities';

describe('when retrieving active connections to a db', function() {
	let target = null;

	beforeEach(() => {
		return utility.killConnections()
			.then(utility.createConnection)
			.then(() => target = new MssqlSnapshot(dbConfig()));
	});

	it('it returns an accurate list that doesn\'t include the current connection', () => {
		return target.connections().should.eventually.have.length(0);
	});
});
