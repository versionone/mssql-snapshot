import 'babel-polyfill';
import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import sinon from 'sinon';
import sinonAsPromised from 'sinon-as-promised';

chai.use(chaiAsPromised);
chai.should();

import config from './databaseConfig';
import MssqlSnapshot from '../src/MssqlSnapshot';

describe("when testing the database connection", function() {
    let target, msg = null;
    before(function() {
        msg = "Unable to connect!";
        target = new MssqlSnapshot(config({ connect: sinon.stub().rejects(Error("Unable to connect!"))}));
    });
    it("fails with an error when config information is missing", () => {
       return target.testConnection().should.eventually
           .be.rejectedWith(msg)
           .and.be.an.instanceOf(Error);
    });
});