import 'babel-polyfill';
import chai from 'chai';

chai.should();

import databaseConfig from '../src/databaseConfig';
import Database from '../src/database';
import MssqlSnapshot from '../src/MssqlSnapshot';

describe("when testing the database connection with invalid config info", function() {
    let target = null;
    beforeEach(function() {
        target = new MssqlSnapshot(new Database({user: "incorrectUser"}))
    });
    it("it rejects with a proper error message", (done) => {
        target.testConnection().then(
            (result) => {
                done(result);
            },
            (err) => {
                err.message.should.eql("Login failed for user 'incorrectUser'.");
                err.code.should.eql("ELOGIN");
                done();
            }
        );
    });
});

describe("when testing the database connection with valid config info", function() {
    let target, dbConfig = null;
    beforeEach(function() {
        dbConfig = databaseConfig();
        target = new MssqlSnapshot(new Database(dbConfig));
    });
    it("it resolves with a success message", (done) => {
        target.testConnection().then(
            (result) => {
                result.should.eql("Success!");
                done()
            },
            (err) => {
                done(err);
            }
        );
    });
});