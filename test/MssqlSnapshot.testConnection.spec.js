import 'babel-polyfill';
import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';

chai.use(chaiAsPromised);
chai.should();

import Database from '../src/database';
import MssqlSnapshot from '../src/MssqlSnapshot';

describe("when testing the database connection with invalid config info", function() {
    let target, msg = null;
    beforeEach(function() {
        msg = "Login failed for user 'incorrectUser'.";
        target = new MssqlSnapshot(new Database({user: "incorrectUser"}))
    });
    it("it rejects with a proper error message", () => {
        target.testConnection().should.be.rejectedWith(msg)
    });
    it("it returns a thenable promise", () => {
        target.testConnection().should.be.an.instanceOf(Promise);
    });
});