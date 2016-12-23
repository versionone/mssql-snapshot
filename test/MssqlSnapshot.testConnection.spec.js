import 'babel-polyfill';
import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';

chai.use(chaiAsPromised);
chai.should();

import MssqlSnapshot from '../src/MssqlSnapshot';
import FakeDb from './fakeDb';

describe("when testing the database connection", function() {
    let fakeDb, target = null;
    beforeEach(function() {
        fakeDb = new FakeDb();
        target = new MssqlSnapshot(fakeDb);
    });
    it("fails with an error when config information is missing", () => {
       return target.testConnection().should.eventually.be.rejectedWith(Error);
    });
});