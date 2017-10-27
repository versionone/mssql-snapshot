import {spy, stub} from 'sinon';
import createSnapshotUtility, {__RewireAPI__} from '../src/mssql-snapshot';

describe('mssql-snapshot', () => {
	describe('exports API', () => {
		it('exports a factory method to create snapshotters', () => {
			mockMssqlSnapshop();

			createSnapshotUtility.should.be.a('function');

			const snapshotter = createSnapshotUtility();
			snapshotter.should.be.a('function');
		});
	});

	describe('the snapshotter callback is invoked with a parameter capable of executing database snapshot operations', () => {
		it('is invoked with parameter containing snapshot API methods', () => {
			mockMssqlSnapshop();
			const cb = spy();
			const promise = createSnapshotUtility()(cb);

			promise.should.eventually.be.fullfilled;
			return promise.then(() => {
				getCbArg(cb).listAll.should.be.a('function');
				getCbArg(cb).connections.should.be.a('function');
				getCbArg(cb).create.should.be.a('function');
				getCbArg(cb).delete.should.be.a('function');
				getCbArg(cb).restore.should.be.a('function');
			});
		});
	});

	describe('snapshotter will connect to the configured database before invoking the callback and close it afterwards', () => {
		let mssqlSnapshot;
		let connect;
		let closeConnection;
		let promise;
		beforeEach(() => {
			connect = stub().returns(Promise.resolve());
			closeConnection = spy();
			mssqlSnapshot = mockMssqlSnapshop(connect, closeConnection);
			promise = createSnapshotUtility(createDatabaseConfig())(spy());
		});

		it('connects', () => {
			return promise.then(() => {
				mssqlSnapshot.should.have.been.calledWith(createDatabaseConfig());
				connect.should.have.been.called;
			});
		});
		it('disconnects', () => {
			return promise.then(() => {
				closeConnection.should.have.been.called;
			});
		});
	});

	describe('connections will list all database connections', () => {
		// throw new Error('Not Implemented Error');
	});
})
;

// --
function mockMssqlSnapshop(connect = stub().returns(Promise.resolve()), closeConnection = spy()) {
	const snapshotStub = stub()
		.returns({
			connect,
			closeConnection,
		});
	createSnapshotUtility.__Rewire__('MssqlSnapshot', snapshotStub);
	return snapshotStub;
}

function getCbArg(cb) {
	return cb.getCall(0).args[0];
}

function createDatabaseConfig(customConfig = {}) {
	return Object.assign(customConfig, {
		connection: 'is there',
	});
}
