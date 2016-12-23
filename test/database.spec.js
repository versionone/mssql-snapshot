import chai from 'chai';
import sql from 'mssql';

import database from '../src/database';

describe("when retrieving a database object to perform queries", function() {
    it("it returns a mssql npm module when no config is supplied", () => {
        database().should.eql(sql);
    });
    it("it returns a mssql npm module when config.isUnitTest is undefined", () => {
       database({}).should.eql(sql);
    });
    it("it return a mssql npm module when config.isUnitTest is false", () => {
       database({isUnitTest: false}).should.eql(sql);
    });
    it("it retuns a fakeDb when config.isUnitTest is true", () => {
        const fakeDb = {connect: () => {}};
        database({isUnitTest: true, fakeDb: fakeDb}).should.eql(fakeDb);
    });
});