import MssqlSnapshot from './MssqlSnapshot';
import {getDbMeta} from './MssqlSnapshot';
export default (config, masterConfig) => cb => {
	if (!masterConfig) {
		masterConfig = {
			...config,
			name: `${config.name}-master`,
			database: 'master'
		}
	}
	const snapshotMgr = new MssqlSnapshot(config, masterConfig);
	return snapshotMgr.connect(config)
		.then(() => cb({
			closeConnection: snapshotMgr.closeConnection,
			config: config,
			masterConfig: masterConfig,
			connections: snapshotMgr.connections,
			create: snapshotMgr.create,
			deleteSnapshot: snapshotMgr.deleteSnapshot,
			getDbMeta: getDbMeta,
			listAll: snapshotMgr.listAll,
			restore: snapshotMgr.restore,
        }));
};
