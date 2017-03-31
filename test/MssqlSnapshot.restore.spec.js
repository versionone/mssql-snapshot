import {createSnapshot, deleteSnapshot} from './testUtilities';
import databaseConfig from '../src/databaseConfig';
import MssqlSnapshot from '../src/MssqlSnapshot';

describe('when restoring and no snapshot name is supplied', function() {
	let target = new MssqlSnapshot(databaseConfig());
	it('throws an error indicating the issue', () => {
		const fn = () => target.restore();
		fn.should.throw('No snapshot name supplied.');
	});
});

describe('when restoring from a snapshot that exists', function() {
	this.timeout(10000);

	let target, dbConfig = null;
	const snapshotName = 'mssql-snapshot-testdb-when-restoring';

	beforeEach(() => {
		dbConfig = databaseConfig();
		target = new MssqlSnapshot(dbConfig);

		return createSnapshot(snapshotName);
	});

	afterEach(() => deleteSnapshot(snapshotName));

	it('it restores successfully', () => {
		return target.restore(snapshotName);
	});
});
