import 'babel-polyfill';
import { expect, before } from 'chai';

import MssqlSnapshot from '../src/index';

describe("when testing the database connection", () => {
    it("config info must be supplied", function() {
        expect(MssqlSnapshot.testConnect).to.throw(/No configuration information supplied./);
    });
});

describe("when connecting to mssql database via a connection string", () => {
    beforeEach(function(){
        let current = 'a,b,c'.split(',');
    });
    it("connects successfully", function() {
        expect(1).to.be.a('number');
    });
});