import path from 'path';

import sql from 'seriate';
import * as Parameters from './Parameters';

export default class MssqlSnapshot {
	constructor() {
		this.connected = false;
	}

	connect(config) {
		return new Promise((resolve, reject) => {
			if (!this.connected) {
				sql.addConnection(config);
				this.connected = true;
				resolve(`connection added: ${config.name}.`);
			}
			resolve(`already connected with: ${config.name}`);
		});
	}

	closeConnection(results, config) {
		return new Promise((resolve, reject) => {
			this.connected = false;
			sql.closeConnection(config);
			resolve(results);
		});
	}

	connections() {
		return sql.execute(this.config.name, {
			query: sql.fromFile('./queries/connections.sql'),
			params: {
				sourceDbName: Parameters.sourceDbName(this.config.database)
			}
		});
	}

	listAll() {
		return sql.execute(this.config.name, {
			query: sql.fromFile('./queries/listSnapshots.sql'),
			params: {
				sourceDbName: Parameters.sourceDbName(this.config.database)
			}
		});
	}

	static _snapshotNameIsValid(snapshotName) {
		if (!snapshotName) throw new Error('No snapshot name supplied.');
		return true;
	}

	create(snapshotName, snapshotStoragePath) {
		MssqlSnapshot._snapshotNameIsValid(snapshotName);
		return getDbMeta(snapshotName, snapshotStoragePath, this.config)
			.then((dbMeta) => {
				return sql.execute(this.config.name, {
					query: sql.fromFile('./queries/createSnapshot.sql'),
					params: {
						query: Parameters.query,
						sourceDbName: Parameters.sourceDbName(this.config.database),
						snapshotName: Parameters.snapshotName(snapshotName),
						logicalName: Parameters.logicalName(dbMeta.LogicalName),
						snapshotPath: {
							val: dbMeta.PhysicalName,
							type: sql.VARCHARMAX
						}
					}
				});
			});
	}

	deleteSnapshot(snapshotName) {
		MssqlSnapshot._snapshotNameIsValid(snapshotName);
		return sql.execute(this.config.name, {
			query: sql.fromFile('./queries/deleteSnapshot.sql'),
			params: {
				snapshotName: Parameters.snapshotName(snapshotName),
				query: Parameters.query
			}
		});
	}

	restore(snapshotName) {
		MssqlSnapshot._snapshotNameIsValid(snapshotName);
		return sql.getPlainContext(this.config.name)
			.step("bringOffline", {
				query: sql.fromFile('./queries/bringOffline.sql'),
				params: {
					sourceDbName: Parameters.sourceDbName(this.config.database),
					query: Parameters.query,
				}
			})
			.step("bringOnline", {
				query: sql.fromFile('./queries/bringOnline.sql'),
				params: {
					sourceDbName: Parameters.sourceDbName(this.config.database),
					query: Parameters.query,
				}
			})
			.step("restoreSnapshot", (execute, data) => {
				execute({
					query: sql.fromFile('./queries/restoreSnapshot.sql'),
					params: {
						snapshotName: Parameters.snapshotName(snapshotName),
						query: Parameters.query,
						sourceDbName: Parameters.sourceDbName(this.config.database)
					}
				});
			})
			.error((err) => {
				console.log(err);
			});
	}
}

export function getDbMeta(snapshotName, snapshotStoragePath, config) {
	return sql.execute(config, {
		query: sql.fromFile('./queries/getDbMeta.sql'),
		params: {
			query: Parameters.query,
			sourceDbName: Parameters.sourceDbName(config.database),
		}
	}).then((result) => ({
		PhysicalName: snapshotStoragePath ? path.join(snapshotStoragePath, snapshotName) : path.join(path.dirname(result[0].PhysicalName), snapshotName),
		LogicalName: result[0].LogicalName,
	}));
}
