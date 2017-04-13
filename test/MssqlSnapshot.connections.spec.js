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

	it('it returns an accurate list that includes the current connection', () => {
		return target.connections().should.eventually.have.length(1);
	});

	it('it returns an object with a set of expected properties', (done) => {
		target.connections().then(
			(result) => {
				result[0].should.have.property('BlockedBy');
				result[0].should.have.property('CPUTime');
				result[0].should.have.property('DatabaseName');
				result[0].should.have.property('DiskIO');
				result[0].should.have.property('LastBatch');
				result[0].should.have.property('Login');
				result[0].should.have.property('ProgramName');
				result[0].should.have.property('HostName');
				result[0].should.have.property('SPID');
				result[0].should.have.property('Status');
				done();
			},
			(err) => {
				done(err);
			});
	});

});
