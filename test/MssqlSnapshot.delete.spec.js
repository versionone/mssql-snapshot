import MssqlSnapshot from '../src/MssqlSnapshot';
import databaseConfig from '../src/databaseConfig'
import {createSnapshot, deleteSnapshot} from './testUtilities';

describe("when deleting a named sql snapshot", function() {
    let target = null;
    beforeEach(() => target = new MssqlSnapshot({}));

    it("it throws when no snapshot name is supplied", () => {
        const fn = () => target.delete();
        fn.should.throw("No snapshot name supplied.");
    });
});

describe("when deleting a named sql snapshot that doesnt exist using valid configuration", function() {
    let target = null;
    const dbConfig = databaseConfig();
    const missingSnapshot = "MissingSnapshot";

    beforeEach(() => target = new MssqlSnapshot(dbConfig));

    it("it returns an message indicating the source of the problem", function() {
        return target.delete(missingSnapshot).should.eventually.deep.equal([{Failure: `When attempting to delete ${missingSnapshot}, the snapshot was not found.`}]);
    });
});

describe("when deleting a named sql snapshot with valid configuration", function() {
    let target = null;
    const dbConfig = databaseConfig();
    const snapshotName = 'mssql-snapshot-testdb-when-deleting';
    beforeEach(() => {
        target = new MssqlSnapshot(dbConfig);
        return createSnapshot(snapshotName);
    });

    it("it returns a success message once deleted", function() {
        return target.delete(snapshotName).should.eventually.eql([{Success: `${snapshotName} was successfully deleted.`}]);
    });
});
