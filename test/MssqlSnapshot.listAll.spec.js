import chai from 'chai';

chai.should();

import {createSnapshot, deleteSnapshot} from './testUtilities';
import databaseConfig from '../src/databaseConfig'
import MssqlSnapshot from '../src/MssqlSnapshot';

describe("when retrieving a list of snapshots and the configuration is valid", function() {
    let target, dbConfig = null;
    const snapshotName = 'mssql-snapshot-testdb-when-retrieving-list';
    let snapshotCreationTime = null;
    beforeEach((done) => {
        dbConfig = databaseConfig();
        target = new MssqlSnapshot(dbConfig);
        createSnapshot(snapshotName).then(
            () => {
                snapshotCreationTime = new Date();
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
    it("it returns one result", (done) => {
        target.listAll().then(
            (result) => {
                result.length.should.eql(1);
                done();
            },
            (err) => {
                done(err);
            }
        );
    });
    it("it returns a result that contains the correct source database name", (done) => {
        target.listAll().then(
            (result) => {
                result[0].SourceDatabase.should.eql(dbConfig.database);
                done();
            },
            (err) => {
                done(err);
            }
        )
    });
    it("it returns a result that contains the correct date of creation", (done) => {
        target.listAll().then(
            (result) => {
                result[0].DateOfCreation.getDay().should.eql(snapshotCreationTime.getDay());
                result[0].DateOfCreation.getYear().should.eql(snapshotCreationTime.getYear());
                result[0].DateOfCreation.getMonth().should.eql(snapshotCreationTime.getMonth());
                result[0].DateOfCreation.getHours().should.eql(snapshotCreationTime.getHours() - 5);
                result[0].DateOfCreation.getMinutes().should.eql(snapshotCreationTime.getMinutes());
                result[0].DateOfCreation.getSeconds().should.eql(snapshotCreationTime.getSeconds());
                done();
            },
            (err) => {
                done(err);
            }
        )
    });
});

describe("when retrieving a list of snapshots and the configuration is invalid", function() {
    let target = null;
    beforeEach(function() {
        target = new MssqlSnapshot({
            name: 'fakeConnection'
        });
    });
    it("it returns a proper error", (done) => {
        target.listAll('fakeConnection').then(
            (result) => {
                done(result);
            },
            (err) => {
                err.code.should.eql('ENOCONN');
                err.message.should.eql('SqlContext Error. Failed on step "__result__" with: "No connection is specified for that request."');
                done();
            });
    });
});