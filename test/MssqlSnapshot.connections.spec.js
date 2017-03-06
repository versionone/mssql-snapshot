import chai from 'chai';

chai.should();

import dbConfig from '../src/databaseConfig';
import MssqlSnapshot from '../src/MssqlSnapshot';
import { createConnection } from './testUtilities';

describe("when retrieving active connections to a db", function() {
    let target = null;
    beforeEach((done) => {
        createConnection().then(
            () => done(),
            (err) => done(err)
        );
        target = new MssqlSnapshot(dbConfig());
    });
    it("it returns an accurate list that doesn't include the current connection", (done) => {
        target.connections().then(
            (result) => {
                result.length.should.eql(0);
                done();
            },
            (err) => {
                done(err);
            }
        );
    });
});