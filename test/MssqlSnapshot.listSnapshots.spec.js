import 'babel-polyfill';
import chai from 'chai';

chai.should();

import databaseConfig from '../src/databaseConfig';
import MssqlSnapshot from '../src/MssqlSnapshot';

describe("when retrieving a list of snapshots", function() {
    let target, dbConfig = null;
    beforeEach(function() {
        dbConfig = databaseConfig();
        target = new MssqlSnapshot(dbConfig);
    });
    it("it returns one result when configuration is valid", (done) => {
        target.listSnapshots().then(
            (result) => {
                result.length.should.be.greaterThan(0);
                done();
            });
    });
});

describe("when retrieving a list of snapshots", function() {
    let target = null;
    beforeEach(function() {
        target = new MssqlSnapshot({});
    });
    it("it returns no results when the configuration is invalid", (done) => {
        target.listSnapshots().then(
            (result) => {
                result.length.should.eql(0);
                done();
            },
            (err) => {
                done(err);  //why does this not throw an error if the config is bad?
            });
    });
});