import {createSnapshot, deleteSnapshot} from './testUtilities';
import databaseConfig from '../src/databaseConfig'
import MssqlSnapshot from '../src/MssqlSnapshot';

describe("when retrieving a list of snapshots and the configuration is valid", function() {
    let target, dbConfig = null;
    const snapshotName = 'mssql-snapshot-testdb-when-retrieving-list';
    let snapshotCreationTime = null;
    beforeEach(() => {
        dbConfig = databaseConfig();
        target = new MssqlSnapshot(dbConfig);
        return createSnapshot(snapshotName).then(() => snapshotCreationTime = new Date());
    });

    afterEach(() => deleteSnapshot(snapshotName));

    it("it returns one result", () => {
        target.listAll().should.eventually.have.length(1);
    });

    it("it returns a result that contains the correct source database name", () => {
        return target.listAll().then((result) => result[0].SourceDatabase.should.eql(dbConfig.database))
	});

	it("it returns a result that contains the correct date of creation", () => {
		this.timeout(15000);
		return target.listAll().then(
			(result) => {
				result[0].DateOfCreation.getDay().should.eql(snapshotCreationTime.getDay());
				result[0].DateOfCreation.getYear().should.eql(snapshotCreationTime.getYear());
				result[0].DateOfCreation.getMonth().should.eql(snapshotCreationTime.getMonth());
				//todo:  the following assertion will fail depending on daylight savings time
				result[0].DateOfCreation.getHours().should.eql(snapshotCreationTime.getHours() - 4);
				result[0].DateOfCreation.getMinutes().should.eql(snapshotCreationTime.getMinutes());
				result[0].DateOfCreation.getSeconds().should.eql(snapshotCreationTime.getSeconds());
			})
	});
});

describe("when retrieving a list of snapshots and the configuration is invalid", function() {
	this.timeout(10000);
    let target = null;
    beforeEach(function() {
        target = new MssqlSnapshot({
            name: 'fakeConnection'
        });
    });
    it("it returns a proper error", (done) => {
        target.listAll('fakeConnection').then(
            (result) => {
                done(result);
            },
            (err) => {
                err.code.should.eql('ENOCONN');
                err.message.should.eql('SqlContext Error. Failed on step "__result__" with: "No connection is specified for that request."');
                done();
            });
    });
});
