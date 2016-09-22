import 'babel-polyfill';
import { expect } from 'chai';

describe("A suite", () => {
    it("contains spec with an expectation", function() {
        expect(1).to.be.a('number');
    });
});