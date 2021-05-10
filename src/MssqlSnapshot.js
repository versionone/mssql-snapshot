import path from 'path';

import sql from 'seriate';
import * as Parameters from './Parameters';

const connectedPools = {};
const connectedWaits = {};
const failedWaits = {};
const closedWaits = {};

function notifyWaits(connected, event, waits) {
	const { name } = event;
	connectedPools[name] = connected;
	const waitsForName = waits[name];
	while (waitsForName && waitsForName.length > 0) {
		const wait = waitsForName.pop();
		wait(name);
	}
}

export function waitForConnect(config) {
	if (connectedPools[config.name]) {
		return Promise.resolve();
	}
	return new Promise((resolve, reject) => {
		let existingWaits = connectedWaits[config.name];
		if (!existingWaits) {
			existingWaits = [];
			connectedWaits[config.name] = existingWaits;
		}
		existingWaits.push(resolve);
		setTimeout(function() {
			const existingIndex = existingWaits.indexOf(resolve);
			existingWaits.splice(existingIndex, 1);
		}, timeout);
		sql.addConnection(config);
	});
}

sql.on('connected', function(connectionEvent) {
	notifyWaits(true, connectionEvent, connectedWaits);
})
sql.on('failed', function(failedEvent) {
	notifyWaits(false, failedEvent, failedWaits);
})
sql.on('closed', function(closedEvent) {
	notifyWaits(false, closedEvent, closedWaits);
})

export default class MssqlSnapshot {
	constructor(config, masterConfig) {
		this.connected = false;
		this.config = config;
		this.masterConfig = masterConfig;
	}

	connect(config) {
		return new Promise((resolve, reject) => {
			if (!this.connected) {
				this.connected = true;
				sql.addConnection(config);
				resolve(`connection added: ${config.name}.`);
			} else {
				resolve(`already connected with: ${config.name}`);
			}
		});
	}

	closeConnection(results, config) {
		return Promise.all([new Promise((resolve, reject) => {
			this.connected = false;
			sql.closeConnection(config);
			resolve();
		}), new Promise((resolve, reject) => {
			this.masterConnected = false;
			sql.closeConnection(this.masterConfig);
			resolve();
		})]).then(results);
	}

	connections() {
		sql.addConnection(this.config);
		return sql.execute(this.config.name, {
			query: sql.fromFile('./queries/connections.sql'),
			params: {
				sourceDbName: Parameters.sourceDbName(this.config.database)
			}
		});
	}

	listAll() {
		sql.addConnection(this.config);
		console.log('sql.addConnection()', this.config.name);
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
		sql.addConnection(this.config);
		return sql.execute(this.config.name, {
			query: sql.fromFile('./queries/deleteSnapshot.sql'),
			params: {
				snapshotName: Parameters.snapshotName(snapshotName),
				query: Parameters.query
			}
		});
	}

	async restore(snapshotName) {
		MssqlSnapshot._snapshotNameIsValid(snapshotName);
		sql.addConnection(this.config);
		const bringOfflineResponse = await sql.getPlainContext(this.config.name)
			.step('bringOffline', {
					query: sql.fromFile('./queries/bringOffline.sql'),
					params: {
						sourceDbName: Parameters.sourceDbName(this.config.database),
						query: Parameters.query,
					}
				});
		sql.addConnection(this.masterConfig);
		return sql.getPlainContext(this.masterConfig.name)
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
				console.log('restore database error', err);
			})
	}
}

export function getDbMeta(snapshotName, snapshotStoragePath, config) {
	sql.addConnection(config);
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
