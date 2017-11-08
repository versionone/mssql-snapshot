import {spy, stub} from 'sinon';
import createSnapshotUtility, {__RewireAPI__} from '../../src/mssql-snapshot';

describe('mssql-snapshot', () => {
	describe('exports the expected API functions', () => {
		it('exports a factory method to create snapshotters', () => {
			createSnapshotUtility.should.be.a('function');
			const snapshotter = createSnapshotUtility();
			snapshotter.should.be.a('function');
		});
	});

	describe('exposes a callback that ', () => {
		it('is invoked with a parameter containing snapshot API methods', () => {
			mockMssqlSnapshot();
			const cb = spy();
			const promise = createSnapshotUtility(createDatabaseConfig())(cb);
			promise.should.eventually.be.fullfilled;

			return promise.then(() => {
				getCbArg(cb).listAll.should.be.a('function');
				getCbArg(cb).connections.should.be.a('function');
				getCbArg(cb).closeConnection.should.be.a('function');
				getCbArg(cb).create.should.be.a('function');
				getCbArg(cb).deleteSnapshot.should.be.a('function');
				getCbArg(cb).restore.should.be.a('function');
				getCbArg(cb).getDbMeta.should.be.a('function');
				getCbArg(cb).config.should.be.an('object');
			});
		});
	});

	describe('will connect to the configured database before invoking the callback', () => {
		let mssqlSnapshot;
		let connect;
		let promise;
		beforeEach(() => {
			connect = stub().returns(Promise.resolve());
			mssqlSnapshot = mockMssqlSnapshot({
				connect,
			});
			promise = createSnapshotUtility(createDatabaseConfig())(spy());
		});

		it('connects', () => {
			return promise.then(() => {
				mssqlSnapshot.should.have.been.called;
				connect.should.have.been.calledWith(createDatabaseConfig());
			});
		});
	});

	describe('the api can', () => {
		const listAll = spy(), connections = spy(), closeConnection = spy(), deleteSnapshot = spy(), create = spy(), restore = spy();
		let target, dbConfig = null;
		beforeEach(() => {
			dbConfig = createDatabaseConfig();
			target = createSnapshotUtility(dbConfig);
			return mockMssqlSnapshot({listAll, connections, closeConnection, create, deleteSnapshot, restore});
		});
		it('list all snapshots', () => {
			return target(api => api.listAll())
				.then(() => listAll.should.have.been.called);
		});
		it('list all connections to the db', () => {
			return target(api => api.connections())
				.then(() => connections.should.have.been.called);
		});
		it('close connections to the db', () => {
			return target(api => api.closeConnection())
				.then(() => closeConnection.should.have.been.called);
		});
		it('display its configuration as it related to the db', () => {
			return target(api => api.config.should.eql(dbConfig));
		});
		it('create a db snapshot', () => {
			return target(api => api.create())
				.then(() => create.should.have.been.called);
		});
		it('delete a db snapshot', () => {
			return target(api => api.deleteSnapshot())
				.then(() => deleteSnapshot.should.have.been.called);
		});
		it('restore a db snapshot', () => {
			return target(api => api.restore())
				.then(() => restore.should.have.been.called);
		});
	});
});

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
