import 'babel-polyfill';
import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';

import config from './databaseConfig';

chai.use(chaiAsPromised);
chai.should();

import MssqlSnapshot from '../src/MssqlSnapshot';

describe("when testing the database connection", () => {
    it("succeeds with the correct connection string", () => {
        return MssqlSnapshot.testConnection(config()).should.eventually.become([{CONNECTION: 'Succeeded'}]);
    });
    it("fails with an error when config information is missing", () => {
       return MssqlSnapshot.testConnection().should.eventually.be.rejectedWith(Error);
    });
});