import path from 'path';

import sql from 'seriate';
import * as Parameters from './Parameters';

export default class MssqlSnapshot {
	constructor(config) {
		if (!config) throw new Error('No configuration supplied to orchestrate the connection interface.');
		this.config = config;
		this.connected = false;
	}

	connect() {
		return new Promise((resolve, reject) => {
			if (!this.connected) {
				sql.addConnection(this.config);
				this.connected = true;
				resolve(`connection added: ${this.config.name}.`);
			}
			resolve(`already connected with: ${this.config.name}`);
		});
	}
	connections() {
		return this.connect()
			.then(() => this._connections());
	}

	_connections() {
		return sql.execute(this.config.name, {
			query: sql.fromFile('./queries/connections.sql'),
			params: {
				sourceDbName: Parameters.sourceDbName(this.config.database)
			}
		});
	}

	listAll() {
		return this.connect()
			.then(() => this._listAll())
	}

	_listAll() {
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

	getDbMeta(snapshotName, snapshotStoragePath = this.config.snapshotStoragePath) {
		return this.connect()
			.then(() => this._getDbMeta(snapshotName, snapshotStoragePath))
	}

	_getDbMeta(snapshotName, snapshotStoragePath) {
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

	create(snapshotName, snapshotStoragePath = this.config.snapshotStoragePath) {
		MssqlSnapshot._snapshotNameIsValid(snapshotName);
		return this.connect()
			.then(() => this._create(snapshotName, snapshotStoragePath))
	}

	_create(snapshotName, snapshotStoragePath) {
		return this.getDbMeta(snapshotName, snapshotStoragePath)
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

	delete(snapshotName) {
		MssqlSnapshot._snapshotNameIsValid(snapshotName);
		return this.connect()
			.then(() => this._delete(snapshotName));
	}

	_delete(snapshotName) {
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
		return this.connect()
			.then(() => this._restore(snapshotName));
	}

	_restore(snapshotName) {
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
