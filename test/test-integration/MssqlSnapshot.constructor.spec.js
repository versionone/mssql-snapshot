import MssqlSnapshot from '../../src/MssqlSnapshot';

describe("when retrieving a database object to perform queries", function() {
    it("it doesnt throw when configuration is supplied", () => {
        const fn = () => new MssqlSnapshot({});
        fn.should.not.throw();
    });
    it("it throws an error when no configuration object is supplied", () => {
        const fn = () => new MssqlSnapshot();
        fn.should.throw("No configuration supplied to orchestrate the connection interface.");
    });
});
