import {createSnapshot, deleteSnapshot} from './testUtilities';
import databaseConfig from '../src/databaseConfig';
import MssqlSnapshot from '../src/MssqlSnapshot';

describe('when retrieving a list of snapshots and the configuration is valid', function() {
	let target, dbConfig = null;
	const snapshotName = 'mssql-snapshot-testdb-when-retrieving-list';
	let snapshotCreationTime = null;

	beforeEach(() => {
		dbConfig = databaseConfig();
		target = new MssqlSnapshot(dbConfig);
		return createSnapshot(snapshotName).then(() => snapshotCreationTime = new Date());
	});

	afterEach(() => deleteSnapshot(snapshotName));

	it('it returns one result', () => {
		target.listAll().should.eventually.have.length(1);
	});

	it('it returns a result that contains the correct source database name', () => {
		return target.listAll().then((result) => result[0].SourceDatabase.should.eql(dbConfig.database));
	});

	it('it returns a result that contains the correct date of creation', () => {
		return target.listAll().then(
			(result) => {
				result[0].DateOfCreation.getDay().should.eql(snapshotCreationTime.getDay());
				result[0].DateOfCreation.getYear().should.eql(snapshotCreationTime.getYear());
				result[0].DateOfCreation.getMonth().should.eql(snapshotCreationTime.getMonth());
				//todo:  the following assertion will fail depending on daylight savings time
				result[0].DateOfCreation.getHours().should.eql(snapshotCreationTime.getHours() - 4);
				result[0].DateOfCreation.getMinutes().should.eql(snapshotCreationTime.getMinutes());
				result[0].DateOfCreation.getSeconds().should.eql(snapshotCreationTime.getSeconds());
			});
	});
});

describe('when retrieving a list of snapshots and the configuration is invalid', function() {
	let target = null;

	beforeEach(() => target = new MssqlSnapshot({name: 'fakeConnection'}));

	it('it returns a proper error', () => {
		target.listAll('fakeConnection').should.be.rejectedWith('SqlContext Error. Failed on step "connecting" with: "No connection named "fakeConnection" exists"');
	});
});
