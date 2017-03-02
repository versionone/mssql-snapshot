import chai from 'chai';

chai.should();

import {createSnapshot, deleteSnapshot} from './testUtilities';
import databaseConfig from '../src/databaseConfig'
import MssqlSnapshot from '../src/MssqlSnapshot';

describe("when restoring and no snapshot name is supplied", function() {
    let target = new MssqlSnapshot(databaseConfig());
    it("throws an error indicating the issue", () => {
        const fn = () => target.restore();
        fn.should.throw("No snapshot name supplied.");
    });
});

describe("when restoring from a snapshot that exists", function() {
    let target, dbConfig = null;
    const snapshotName = 'mssql-snapshot-testdb-when-restoring';
    beforeEach((done) => {
        dbConfig = databaseConfig();
        target = new MssqlSnapshot(dbConfig);
        function create() {
            return createSnapshot(snapshotName).then(
                () => {done()},
                (err) => {done(err)}
            );
        }
        function del() {
            return deleteSnapshot(snapshotName).then(
                () => {},
                (err) => done(err)
            );
        }
        del().then(create);
    });
    afterEach((done) => {
        deleteSnapshot(snapshotName).then(
            () => done(),
            (err) => done(err)
        );
    });
    it("it restores successfully", (done) => {
        target.restore(snapshotName).then(
            (result) => {
                result.length.should.eql(1);
                done();
            },
            (err) => {
                done(err);
            }
        );
    });
});
