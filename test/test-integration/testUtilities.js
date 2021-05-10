import sql from 'seriate';
import databaseConfig from '../../src/databaseConfig'
import * as Parameters from '../../src/Parameters';
import path from 'path';
import fs from 'fs';

export function createConnection() {
	const config = databaseConfig();
	sql.addConnection(config);
	return sql.execute(config.name, {
		query: `SELECT 1`
	});
}

export function snapshotExists(snapshotName) {
	const config = databaseConfig();
	sql.addConnection(config);
	return sql.execute(config, {
		query: sql.fromFile('../../src/queries/listSnapshots.sql'),
		params: {
			sourceDbName: Parameters.sourceDbName(config.database),
		}
	})
		.then(results => results
			.reduce((prev, result) => prev || result.SnapshotDatabase === snapshotName, false)
		);
}

export function getDbMeta(snapshotName) {
	const config = databaseConfig();
	sql.addConnection(config);
	return sql.execute(config, {
		query: sql.fromFile('../../src/queries/getDbMeta.sql'),
		params: {
			query: Parameters.query,
			sourceDbName: Parameters.sourceDbName(config.database),
		}
	}).then((result) => {
		return ({
			PhysicalName: path.join(path.dirname(result[0].PhysicalName), snapshotName),
			LogicalName: result[0].LogicalName,
		});
	});
}

export function killConnections() {
	const config = databaseConfig();
	const masterConfig = {
		...config,
		name: `${config.name}-master`,
		database: 'master'
	}
	sql.addConnection(masterConfig);
	return sql.getPlainContext(masterConfig.name)
		.step("bringOffline", {
			query: sql.fromFile('../../src/queries/bringOffline.sql'),
			params: {
				sourceDbName: Parameters.sourceDbName(config.database),
				query: Parameters.query,
			}
		})
		.step("bringOnline", {
			query: sql.fromFile('../../src/queries/bringOnline.sql'),
			params: {
				sourceDbName: Parameters.sourceDbName(config.database),
				query: Parameters.query,
			}
		})
		.error((err) => {
			console.log(err);
		}).then(() => {
			sql.closeConnection(masterConfig);
		});
}

export function bringOnline() {
	const config = databaseConfig();
	const masterConfig = {
		...config,
		name: `${config.name}-master`,
		database: 'master'
	}
	sql.addConnection(masterConfig);
	return sql.execute(masterConfig, {
			query: sql.fromFile('../../src/queries/bringOnline.sql'),
			params: {
				sourceDbName: Parameters.sourceDbName(config.database),
				query: Parameters.query,
			}
		}).catch(err => {
			console.err("an error", err);
		}).then(() => {
			sql.closeConnection(masterConfig);
			sql.closeConnection(config);
		});
}

export function deleteSnapshot(snapshotName) {
	const config = databaseConfig();
	sql.addConnection(config);
	return sql.execute(config, {
		query: sql.fromFile('../../src/queries/deleteSnapshot.sql'),
		params: {
			snapshotName: Parameters.snapshotName(snapshotName),
			query: Parameters.query
		}
	});
}

export function createSnapshot(snapshotName, logicalName, snapshotStoragePath) {
	const config = databaseConfig();
	sql.addConnection(config);
	return sql.execute(config, {
		query: sql.fromFile('../../src/queries/createSnapshot.sql'),
		params: {
			query: Parameters.query,
			sourceDbName: Parameters.sourceDbName(config.database),
			logicalName: Parameters.logicalName(logicalName),
			snapshotName: Parameters.snapshotName(snapshotName),
			snapshotPath: Parameters.snapshotPath(snapshotStoragePath || config.snapshotStoragePath)
		}
	});
}
