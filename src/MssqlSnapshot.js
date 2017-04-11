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

	create(snapshotName, connectionName = this.config.name, snapshotStoragePath = this.config.snapshotStoragePath) {
		this._snapshotNameIsValid(snapshotName);
		const qualifiedPath = snapshotStoragePath + snapshotName;

		return sql.execute(connectionName, {
			query: sql.fromFile('./queries/createSnapshot.sql'),
			params: {
				query: Parameters.query,
				sourceDbName: Parameters.sourceDbName(this.config.database),
				snapshotName: Parameters.snapshotName(snapshotName),
				snapshotPath: {
					val: qualifiedPath,
					type: sql.VARCHAR(200)
				}
			}
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

	_setSingleUser(connectionName = this.config.name) {
		return sql.execute(connectionName, {
			query: sql.fromFile('./queries/setSingleUser.sql'),
			params: {
				sourceDbName: Parameters.sourceDbName(this.config.database),
				query: Parameters.query
			}
		});
	}

	_setMultiUser(connectionName = this.config.name) {
		return sql.execute(connectionName, {
			query: sql.fromFile('./queries/setMultiUser.sql'),
			params: {
				sourceDbName: Parameters.sourceDbName(this.config.database),
				query: Parameters.query
			}
		});
	}

	restore(snapshotName, connectionName = this.config.name) {
		this._snapshotNameIsValid(snapshotName);
		const restore = () => {
			return sql.execute(connectionName, {
				query: sql.fromFile('./queries/restoreSnapshot.sql'),
				params: {
					snapshotName: Parameters.snapshotName(snapshotName),
					query: Parameters.query,
					sourceDbName: Parameters.sourceDbName(this.config.database)
				}
			});
		};
		return Promise.all(
			[
				this._setSingleUser(connectionName),
				restore,
				this._setMultiUser(connectionName)
			]
		);
	}
}
