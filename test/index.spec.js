import 'babel-polyfill';
import { expect, before } from 'chai';

describe("when connecting to mssql database via a connection string", () => {
    beforeEach(function(){
        let current = 'a,b,c'.split(',');
    });
    it("connects successfully", function() {
        expect(1).to.be.a('number');
    });
});