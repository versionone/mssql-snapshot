import path from 'path';

import MssqlSnapshot from '../src/MssqlSnapshot';
import databaseConfig from '../src/databaseConfig';
import {getDbMeta} from './testUtilities';

describe('when retrieving database meta for a snapshot', function() {
	let targetWithSnapshotStoragePath, configWithSnapshotStoragePath, defaultTarget, expectedUnconfiguredPath, expectedConfiguredPath = null;
	const snapshotName = 'mssql-snapshot-testdb-get-path';

	beforeEach(() => {
		configWithSnapshotStoragePath = Object.assign(databaseConfig(), {snapshotStoragePath: 'c:\\snapshots'});
		expectedConfiguredPath = path.join(configWithSnapshotStoragePath.snapshotStoragePath, snapshotName);
		targetWithSnapshotStoragePath = new MssqlSnapshot(configWithSnapshotStoragePath);
		defaultTarget = new MssqlSnapshot(databaseConfig());
		return getDbMeta(snapshotName).then((result) => expectedUnconfiguredPath = result);
	});

	it('it returns the path defined in config if one is present', function() {
		return targetWithSnapshotStoragePath.getDbMeta(snapshotName, configWithSnapshotStoragePath.snapshotStoragePath)
			.should.eventually.have.property("PhysicalName", path.join(configWithSnapshotStoragePath.snapshotStoragePath, snapshotName));
	});

	it('it returns the path that the source db is stored in if no storage path is defined', function() {
		return defaultTarget.getDbMeta(snapshotName)
			.should.eventually.eql(expectedUnconfiguredPath);
	});

});
