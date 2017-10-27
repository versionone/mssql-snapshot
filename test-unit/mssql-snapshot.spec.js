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
			mssqlSnapshot = mockMssqlSnapshop({
				connect,
				closeConnection,
			});
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

	describe('can list all snapshots', () => {
		const _listAll = spy();
		mockMssqlSnapshop({
			_listAll,
		});
		createSnapshotUtility(createDatabaseConfig())(api => api.listAll())
			.then(() => _listAll.should.have.been.called);
	});

	describe('can list all database connections', () => {
		const _connections = spy();
		mockMssqlSnapshop({
			_connections,
		});
		createSnapshotUtility(createDatabaseConfig())(api => api.connections())
			.then(() => _connections.should.have.been.called);
	});

	describe('can create a snapshot', () => {
		const _create = spy();
		mockMssqlSnapshop({
			_create,
		});
		createSnapshotUtility(createDatabaseConfig())(api => api.create())
			.then(() => _create.should.have.been.called);
	});

	describe('can delete a snapshot', () => {
		const _delete = spy();
		mockMssqlSnapshop({
			_delete,
		});
		createSnapshotUtility(createDatabaseConfig())(api => api.delete())
			.then(() => _delete.should.have.been.called);
	});

	describe('can restore a snapshot', () => {
		const _restore = spy();
		mockMssqlSnapshop({
			_restore,
		});
		createSnapshotUtility(createDatabaseConfig())(api => api.restore())
			.then(() => _restore.should.have.been.called);
	});
});

// --
function mockMssqlSnapshop(api = {}) {
	const snapshotStub = stub()
		.returns(Object.assign(
			{
				_connections: spy(),
				_delete: spy(),
				_create: spy(),
				_listAll: spy(),
				_restore: spy(),
				closeConnection: spy(),
				connect: stub().returns(Promise.resolve()),
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
