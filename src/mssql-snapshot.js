import MssqlSnapshot from './MssqlSnapshot';

export default (config) => cb => {
	const snapshotMgr = new MssqlSnapshot(config);
	return snapshotMgr.connect()
		.then(() => cb({
			connections: snapshotMgr._connections,
			create: snapshotMgr._create,
			restore: snapshotMgr._restore,
			listAll: snapshotMgr._listAll,
			delete: snapshotMgr._delete,
		}))
		.then(snapshotMgr.closeConnection);
};
