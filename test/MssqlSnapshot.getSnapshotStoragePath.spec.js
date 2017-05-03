import path from 'path';

import MssqlSnapshot from '../src/MssqlSnapshot';
import databaseConfig from '../src/databaseConfig';
import {getPhysicalPath} from './testUtilities';

describe('when retrieving the storage path for a snapshot', function() {
	let targetWithSnapshotStoragePath, configWithSnapshotStoragePath, defaultTarget, expectedUnconfiguredPath, expectedConfiguredPath = null;
	const snapshotName = 'mssql-snapshot-testdb-get-path';

	beforeEach(() => {
		configWithSnapshotStoragePath = Object.assign(databaseConfig(), {snapshotStoragePath: 'c:\\snapshots'});
		expectedConfiguredPath = path.join(configWithSnapshotStoragePath.snapshotStoragePath, snapshotName);
		targetWithSnapshotStoragePath = new MssqlSnapshot(configWithSnapshotStoragePath);
		defaultTarget = new MssqlSnapshot(databaseConfig());
		return getPhysicalPath(databaseConfig().database, snapshotName).then((result) => expectedUnconfiguredPath = result);
	});

	it('it returns the path defined in config if one is present', function() {
		return targetWithSnapshotStoragePath.getSnapshotStoragePath(snapshotName, configWithSnapshotStoragePath.snapshotStoragePath)
			.should.eventually.equal(expectedConfiguredPath);
	});

	it('it returns the path that the source db is stored if no storage path is defined', function() {
		return defaultTarget.getSnapshotStoragePath(snapshotName)
			.should.eventually.eql(expectedUnconfiguredPath);
	});

});
