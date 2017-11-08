import MssqlSnapshot from './MssqlSnapshot';
import {getDbMeta} from './MssqlSnapshot';
export default (config) => cb => {
	const snapshotMgr = new MssqlSnapshot();
	return snapshotMgr.connect(config)
		.then(() => cb({
			closeConnection: snapshotMgr.closeConnection,
			config: config,
			connections: snapshotMgr.connections,
			create: snapshotMgr.create,
			deleteSnapshot: snapshotMgr.deleteSnapshot,
			getDbMeta: getDbMeta,
			listAll: snapshotMgr.listAll,
			restore: snapshotMgr.restore,
        }));
};
