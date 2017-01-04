import chai from 'chai';
import sql from 'seriate';

chai.should();

import Database from '../src/Database';

describe("when retrieving a database object to perform queries", function() {
    it("it returns a seriate npm module when configuration is supplied", () => {
        new Database({}).retrieve().should.eql(sql);
    });
});