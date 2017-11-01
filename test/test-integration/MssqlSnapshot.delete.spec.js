import createSnapshotUtility from '../../src/mssql-snapshot';
import databaseConfig from '../../src/databaseConfig'
import {createSnapshot, getDbMeta, deleteSnapshot} from './testUtilities';

describe("when deleting a named sql snapshot", function() {
    let target = null;
    beforeEach(() => target = createSnapshotUtility({}));

    it("it throws when no snapshot name is supplied", () => {
        target((api) => api.deleteSnapshot()).should.be.rejected;
    });
});

describe("when deleting a named sql snapshot that doesnt exist using valid configuration", function() {
    let target = null;
    const dbConfig = databaseConfig();
    const missingSnapshot = "MissingSnapshot";

    beforeEach(() => target = createSnapshotUtility(dbConfig));

    it("it returns an message indicating the source of the problem", function() {
        return target((api) => api.deleteSnapshot(missingSnapshot)).should.eventually.deep.equal([{Failure: `When attempting to delete ${missingSnapshot}, the snapshot was not found.`}]);
    });
});

describe("when deleting a named sql snapshot with valid configuration", function() {
    let target = null;
    const dbConfig = databaseConfig();
    const snapshotName = 'mssql-snapshot-testdb-when-deleting';
    beforeEach(() => {
        target = createSnapshotUtility(dbConfig);
        return getDbMeta(snapshotName)
					.then((result) => createSnapshot(snapshotName, result.LogicalName, result.PhysicalName)
		);
    });
    afterEach(() => deleteSnapshot(snapshotName));

    it("it returns a success message once deleted", function() {
        return target((api) => api.deleteSnapshot(snapshotName)).should.eventually.eql([{Success: `${snapshotName} was successfully deleted.`}]);
    });
});
