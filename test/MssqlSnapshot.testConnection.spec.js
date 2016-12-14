import 'babel-polyfill';
import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';

chai.use(chaiAsPromised);
chai.should();

import MssqlSnapshot from '../src/MssqlSnapshot';

describe("when testing the database connection", () => {
    it("succeeds with the correct connection string", (done) => {
        return MssqlSnapshot.testConnection("mssql://pub:pub@localhost/V1Demo").should.eventually.become([{CONNECTION: 'Succeeded'}]).notify(done);
    });
});