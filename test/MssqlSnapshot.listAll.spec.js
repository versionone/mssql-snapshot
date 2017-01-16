import 'babel-polyfill';
import chai from 'chai';

chai.should();

import databaseConfig from '../src/databaseConfig'
import MssqlSnapshot from '../src/MssqlSnapshot';

describe("when retrieving a list of snapshots", function() {
    let target, dbConfig = null;
    beforeEach(function() {
        dbConfig = databaseConfig();
        target = new MssqlSnapshot(dbConfig);
    });
    it("it returns one result when configuration is valid", (done) => {
        target.listAll().then(
            (result) => {
                result.length.should.be.greaterThan(0);
                done();
            },
            (err) => {
                done(err);
            });
    });
});

describe("when retrieving a list of snapshots", function() {
    let target = null;
    beforeEach(function() {
        target = new MssqlSnapshot({
            name: 'fakeConnection'
        });
    });
    it("it returns no results when the configuration is invalid", (done) => {
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