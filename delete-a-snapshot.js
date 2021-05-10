import databaseConfig from './src/databaseConfig';
import createSnapshotUtility from './src/mssql-snapshot';

const snapshotter = createSnapshotUtility(databaseConfig());
snapshotter((api) => api.deleteSnapshot('mssql-snapshot-testdb-when-creating'))
