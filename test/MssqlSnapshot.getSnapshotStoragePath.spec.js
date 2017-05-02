import path from 'path';

import MssqlSnapshot from '../src/MssqlSnapshot';
import databaseConfig from '../src/databaseConfig';

describe('when retrieving the storage path for a snapshot', function() {
	let targetWithSnapshotStoragePath, configWithSnapshotStoragePath, defaultTarget = null;
	const snapshotName = 'mssql-snapshot-testdb-get-path';
	const expectedPath = path.join('C:\\Program Files\\Microsoft SQL Server\\MSSQL12.MSSQLSERVER\\MSSQL\\DATA', snapshotName);

	beforeEach(() => {
		configWithSnapshotStoragePath = Object.assign(databaseConfig(), {snapshotStoragePath: 'c:\\snapshots'});
		targetWithSnapshotStoragePath = new MssqlSnapshot(configWithSnapshotStoragePath);
		defaultTarget = new MssqlSnapshot(databaseConfig());
	});

	it('it returns the path defined in config if one is present', function() {
		return targetWithSnapshotStoragePath.getSnapshotStoragePath(snapshotName, configWithSnapshotStoragePath.snapshotStoragePath)
			.should.eventually.equal('c:\\snapshots\\mssql-snapshot-testdb-get-path');
	});

	it('it returns the path that the source db is stored if no storage path is defined', function() {
		return defaultTarget.getSnapshotStoragePath(snapshotName)
			.should.eventually.eql(expectedPath);
	});

});
