import chai from 'chai';
chai.should();

import MssqlSnapshot from '../src/MssqlSnapshot';
import databaseConfig from '../src/databaseConfig'
import {deleteSnapshot} from './testUtilities';

describe("when creating a named sql snapshot", function() {
    let target = null;
    beforeEach(() => {
        target = new MssqlSnapshot({});
    });
    it("it throws when no snapshot name is supplied", () => {
        const fn = () => target.create();
        fn.should.throw("No snapshot name supplied.");
    });
});

describe("when creating a named sql snapshot with valid configuration", function() {
    let target = null;
    const dbConfig = databaseConfig();
    const snapshotName = 'mssql-snapshot-testdb-when-creating';
    beforeEach(() => {
        target = new MssqlSnapshot(dbConfig);
    });
    afterEach(() => {
        deleteSnapshot(snapshotName);
    });
    it("it returns a success message once created", function(done) {
        target.create(snapshotName).then(
            (result) => {
                result.length.should.eql(1);
                result[0].should.eql({Success: `${snapshotName} was successfully created.`});
                done();
            },
            (err) => {
                done(err);
            }
        );
    });
});