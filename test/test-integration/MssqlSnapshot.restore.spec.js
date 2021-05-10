import {createSnapshot, deleteSnapshot, createConnection, bringOnline} from './testUtilities';
import databaseConfig from '../../src/databaseConfig';
import createSnapshotUtility from '../../src/mssql-snapshot';

describe('when restoring and no snapshot name is supplied', function() {
	let target = createSnapshotUtility(databaseConfig());
	it('throws an error indicating the issue', () => {
		target((api) => api.restore()).should.be.rejected;
	});
});

describe('when restoring from a snapshot that exists', function() {
	let target = null;
	const snapshotName = 'mssql-snapshot-testdb-when-restoring';

	beforeEach(() => {
		target = createSnapshotUtility(databaseConfig());
		return createSnapshot(snapshotName);
	});

	afterEach(() => deleteSnapshot(snapshotName));

	it('it restores successfully', () => {
		return target((api) => api.restore(snapshotName)).should.be.fulfilled;
	});
});

describe('when restoring from a snapshot that exists and active connections exist to the source db', function() {
	let target = null;
	const snapshotName = 'mssql-snapshot-testdb-when-restoring';

	beforeEach(() => {
		target = createSnapshotUtility(databaseConfig());
		return Promise.all([createSnapshot(snapshotName), createConnection]);
	});

	afterEach(() => deleteSnapshot(snapshotName).then(bringOnline));

	it('it restores successfully', () => {
		return target((api) => api.restore(snapshotName)).should.be.fulfilled;
	});
});
