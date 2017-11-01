import MssqlSnapshot from './MssqlSnapshot';
import {getDbMeta} from './MssqlSnapshot';
export default (config) => cb => {
	const snapshotMgr = new MssqlSnapshot();
	return snapshotMgr.connect(config)
		.then(() => cb({
			connections: snapshotMgr.connections,
			create: snapshotMgr.create,
			restore: snapshotMgr.restore,
			listAll: snapshotMgr.listAll,
			deleteSnapshot: snapshotMgr.deleteSnapshot,
			getDbMeta: getDbMeta,
            config: config,
        }))
		.then(snapshotMgr.closeConnection);
};
