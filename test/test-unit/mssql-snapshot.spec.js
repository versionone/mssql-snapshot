import {spy, stub} from 'sinon';
import createSnapshotUtility, {__RewireAPI__} from '../../src/mssql-snapshot';

describe('mssql-snapshot', () => {
	describe('exports API', () => {
		it('exports a factory method to create snapshotters', () => {
			createSnapshotUtility.should.be.a('function');
			const snapshotter = createSnapshotUtility();
			snapshotter.should.be.a('function');
		});
	});

	describe('the snapshotter callback', () => {
		it('is invoked with parameter containing snapshot API methods', () => {
			mockMssqlSnapshot();
			const cb = spy();
			const promise = createSnapshotUtility(createDatabaseConfig())(cb);
			promise.should.eventually.be.fullfilled;

			return promise.then(() => {
				getCbArg(cb).listAll.should.be.a('function');
				getCbArg(cb).connections.should.be.a('function');
				getCbArg(cb).create.should.be.a('function');
				getCbArg(cb).deleteSnapshot.should.be.a('function');
				getCbArg(cb).restore.should.be.a('function');
				getCbArg(cb).getDbMeta.should.be.a('function');
				getCbArg(cb).config.should.be.an('object');
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
			mssqlSnapshot = mockMssqlSnapshot({
				connect,
				closeConnection,
			});
			promise = createSnapshotUtility(createDatabaseConfig())(spy());
		});

		it('connects', () => {
			return promise.then(() => {
				mssqlSnapshot.should.have.been.called;
				connect.should.have.been.calledWith(createDatabaseConfig());
			});
		});
		it('disconnects', () => {
			return promise.then(() => {
				closeConnection.should.have.been.called;
			});
		});
	});

	describe('can list all snapshots', () => {
		const listAll = spy();
		mockMssqlSnapshot({
			listAll,
		});
		createSnapshotUtility(createDatabaseConfig())(api => api.listAll())
			.then(() => listAll.should.have.been.called);
	});

	describe('can list all database connections', () => {
		const connections = spy();
		mockMssqlSnapshot({
			connections,
		});
		createSnapshotUtility(createDatabaseConfig())(api => api.connections())
			.then(() => connections.should.have.been.called);
	});

	describe('can create a snapshot', () => {
		const create = spy();
		mockMssqlSnapshot({
			create,
		});
		createSnapshotUtility(createDatabaseConfig())(api => api.create())
			.then(() => create.should.have.been.called);
	});

	describe('can delete a snapshot', () => {
		const deleteSnapshot = spy();
		mockMssqlSnapshot({
			deleteSnapshot,
		});
		createSnapshotUtility(createDatabaseConfig())(api => api.deleteSnapshot())
			.then(() => deleteSnapshot.should.have.been.called);
	});

	describe('can restore a snapshot', () => {
		const restore = spy();
		mockMssqlSnapshot({
			restore,
		});
		createSnapshotUtility(createDatabaseConfig())(api => api.restore())
			.then(() => restore.should.have.been.called);
	});
});

// --
function mockMssqlSnapshot(api = {}) {
	const snapshotStub = stub()
		.returns(Object.assign(
			{
				connections: spy(),
				deleteSnapshot: spy(),
				create: spy(),
				listAll: spy(),
				restore: spy(),
				closeConnection: spy(),
				connect: stub().returns(Promise.resolve()),
				getDbMeta: stub(),
				config: stub(),
			},
			api,
		));
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
