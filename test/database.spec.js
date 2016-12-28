import chai from 'chai';
import sql from 'mssql';

chai.should();

import Database from '../src/Database';

describe("when retrieving a database object to perform queries", function() {
    it("it returns a mssql npm module when configuration is supplied", () => {
        new Database({}).retrieve().should.eql(sql);
    });
    it("it throws an error when no configuration object is supplied", () => {
        const fn = () => new Database();
        fn.should.throw("No configuration supplied to orchestrate the connection interface.");
    });
});