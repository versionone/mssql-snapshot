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

	getSnapshotStoragePath(snapshotName, snapshotStoragePath = this.config.snapshotStoragePath) {
		if (snapshotStoragePath)
			return Promise.resolve(path.join(snapshotStoragePath, snapshotName));
		return sql.execute(this.config, {
			query: sql.fromFile('./queries/getPhysicalPath.sql'),
			params: {
				sourceDbName: Parameters.sourceDbName(this.config.database),
			}
		}).then((result) => path.join(path.dirname(result[0].filename), snapshotName));
	}

	create(snapshotName, connectionName = this.config.name, snapshotStoragePath = this.config.snapshotStoragePath) {
		this._snapshotNameIsValid(snapshotName);
		return this.getSnapshotStoragePath(snapshotName, snapshotStoragePath)
			.then((storagePath) => {
				return sql.execute(connectionName, {
					query: sql.fromFile('./queries/createSnapshot.sql'),
					params: {
						query: Parameters.query,
						sourceDbName: Parameters.sourceDbName(this.config.database),
						snapshotName: Parameters.snapshotName(snapshotName),
						snapshotPath: {
							val: storagePath,
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
			.step("killConnections", {
				query: sql.fromFile('./queries/killConnections.sql'),
				params: {
					sourceDbName: Parameters.sourceDbName(this.config.database),
					kill: sql.VARCHAR(8000),
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
