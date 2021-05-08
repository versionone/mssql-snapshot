import createSnapshotUtility from '../../src/mssql-snapshot';
import databaseConfig from '../../src/databaseConfig';
import { deleteSnapshot, snapshotExists } from './testUtilities';

describe('when creating a named sql snapshot', function() {
	let target = null;

	beforeEach(() => target = createSnapshotUtility({}));

	it('it throws when no snapshot name is supplied', () => {
		target((api) => api.create()).should.be.rejected;
	});
});

describe('when creating a named sql snapshot with valid configuration', function() {
	const dbConfig = databaseConfig();
	const snapshotName = 'mssql-snapshot-testdb-when-creating';

	beforeEach(() => {
		let target = createSnapshotUtility(dbConfig);
		return target((api) => api.create(snapshotName));
	});

	afterEach(() => deleteSnapshot(snapshotName));

	it('the snapshot file exists on disk', () => snapshotExists(snapshotName).should.eventually.eql(true));
});
