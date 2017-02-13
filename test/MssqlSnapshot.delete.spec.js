import chai from 'chai';
chai.should();

import MssqlSnapshot from '../src/MssqlSnapshot';
import databaseConfig from '../src/databaseConfig'
import {createSnapshot, deleteSnapshot} from './testUtilities';

describe("when deleting a named sql snapshot", function() {
    let target = null;
    beforeEach(() => {
        target = new MssqlSnapshot({});
    });
    it("it throws when no snapshot name is supplied", () => {
        const fn = () => target.delete();
        fn.should.throw("No snapshot name supplied.");
    });
});

describe("when deleting a named sql snapshot with valid configuration", function() {
    let target = null;
    const dbConfig = databaseConfig();
    const snapshotName = 'mssql-snapshot-testdb-when-deleting';
    beforeEach((done) => {
        target = new MssqlSnapshot(dbConfig);
        createSnapshot(snapshotName).then(
            () => {
                done()
            },
            (err) => {
                done(err);
            }
        );
    });
    afterEach((done) => {
        deleteSnapshot(snapshotName).then(
            () => {
                done();
            },
            (err) => {
                done(err);
            }
        );
    });
    it("it returns a success message once deleted", function(done) {
        target.delete(snapshotName).then(
            (result) => {
                console.log(result);
                result[0].should.eql({Success: `${snapshotName} was successfully deleted.`});
                done();
            },
            (err) => {
                done(err);
            }
        );
    });
});