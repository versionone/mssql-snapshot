import dbConfig from '../../src/databaseConfig';
import MssqlSnapshot from '../../src/MssqlSnapshot';
import {killConnections, createConnection} from './testUtilities';

describe('when retrieving active connections to a db', function() {
	let target = null;

	beforeEach(() => {
		target = new MssqlSnapshot(dbConfig());
		return Promise.all([killConnections, createConnection]);
	});

	it('it returns an accurate list that includes the current connection', (done) => {
		target.connections().then(
			(result) => {
				result.length.should.eql(1);
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
