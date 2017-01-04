import chai from 'chai';

chai.should();

import Database from '../src/Database';
import dbConfig from '../src/databaseConfig';

describe("when retrieving the database name", function() {
    it("it returns a name that matches that supplied in the config", () => {
        new Database(dbConfig()).sourceDbName().should.eql(dbConfig().database);
    });
});