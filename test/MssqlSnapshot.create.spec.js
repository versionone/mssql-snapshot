import fs from 'fs';

import MssqlSnapshot from '../src/MssqlSnapshot';
import databaseConfig from '../src/databaseConfig';
import {deleteSnapshot, getPhysicalPath, fileExists} from './testUtilities';

describe('when creating a named sql snapshot', function() {
	let target = null;

	beforeEach(() => target = new MssqlSnapshot({}));

	it('it throws when no snapshot name is supplied', () => {
		const fn = () => target.create();
		fn.should.throw('No snapshot name supplied.');
	});
});

describe('when creating a named sql snapshot with valid configuration', function() {
	const dbConfig = databaseConfig();
	const snapshotName = 'mssql-snapshot-testdb-when-creating';

	beforeEach(() => {
		let target = new MssqlSnapshot(dbConfig);
		return Promise.all([target.create(snapshotName)]);
	});

	afterEach(() => deleteSnapshot(snapshotName));

	it('the snapshot file exists on disk', function() {
		return getPhysicalPath(dbConfig.database, snapshotName).then(filePath => {
			return fileExists(filePath).should.eventually.eql(true);
		});
	});

});
