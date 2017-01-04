import 'babel-polyfill';
import chai from 'chai';

chai.should();

import databaseConfig from '../src/databaseConfig';
import Database from '../src/database';
import MssqlSnapshot from '../src/MssqlSnapshot';

describe("when testing the database connection with valid config info", function() {
    let target, dbConfig = null;
    beforeEach(function() {
        dbConfig = databaseConfig();
        target = new MssqlSnapshot(new Database(dbConfig));
    });
    it("it resolves with a success message", (done) => {
        target.testConnection().then(
            (result) => {
                result.should.eql([{Connection: 'Successful'}]);
                done()
            },
            (err) => {
                done(err);
            }
        );
    });
});