import chai from 'chai';
import sql from 'seriate';

chai.should();

import Database from '../src/Database';

describe("when retrieving a database object to perform queries", function() {
    it("it doesnt throw when configuration is supplied", () => {
        const fn = () => new Database({});
        fn.should.not.throw();
    });
    it("it throws an error when no configuration object is supplied", () => {
        const fn = () => new Database();
        fn.should.throw("No configuration supplied to orchestrate the connection interface.");
    });
});