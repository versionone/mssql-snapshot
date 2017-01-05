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
    it("it returns one result", (done) => {
        target.listSnapshots().then(
            (result) => {
                result.length.should.be.greaterThan(0);
                done();
            });
    });
});