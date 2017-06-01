import path from 'path';

import sql from 'seriate';
import * as Parameters from './Parameters';

export default class MssqlSnapshot {
	constructor(config) {
		if (!config) throw new Error('No configuration supplied to orchestrate the connection interface.');
		this.config = config;

		sql.addConnection(this.config);
	}

	connections(connectionName = this.config.name) {
		return sql.execute(connectionName, {
			query: sql.fromFile('./queries/connections.sql'),
			params: {
				sourceDbName: Parameters.sourceDbName(this.config.database)
			}
		});
	}

	listAll(connectionName = this.config.name) {
		return sql.execute(connectionName, {
			query: sql.fromFile('./queries/listSnapshots.sql'),
			params: {
				sourceDbName: Parameters.sourceDbName(this.config.database)
			}
		});
	}

	_snapshotNameIsValid(snapshotName) {
		if (!snapshotName) throw new Error('No snapshot name supplied.');
		return true;
	}

	getDbMeta(snapshotName, snapshotStoragePath = this.config.snapshotStoragePath) {
		return sql.execute(this.config, {
			query: sql.fromFile('./queries/getDbMeta.sql'),
			params: {
				query: Parameters.query,
				sourceDbName: Parameters.sourceDbName(this.config.database),
			}
		}).then((result) => ({
			PhysicalName: snapshotStoragePath ? path.join(snapshotStoragePath, snapshotName) : path.join(path.dirname(result[0].PhysicalName), snapshotName),
			LogicalName: result[0].LogicalName,
        }));
	}

	create(snapshotName, connectionName = this.config.name, snapshotStoragePath = this.config.snapshotStoragePath) {
		this._snapshotNameIsValid(snapshotName);
		return this.getDbMeta(snapshotName, snapshotStoragePath)
			.then((dbMeta) => {
				return sql.execute(connectionName, {
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

	delete(snapshotName, connectionName = this.config.name) {
		this._snapshotNameIsValid(snapshotName);
		return sql.execute(connectionName, {
			query: sql.fromFile('./queries/deleteSnapshot.sql'),
			params: {
				snapshotName: Parameters.snapshotName(snapshotName),
				query: Parameters.query
			}
		});
	}

	restore(snapshotName, connectionName = this.config.name) {
		this._snapshotNameIsValid(snapshotName);
		return sql.getPlainContext(connectionName)
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
