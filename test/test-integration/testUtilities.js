import sql from 'seriate';
import databaseConfig from '../../src/databaseConfig'
import * as Parameters from '../../src/Parameters';
import path from 'path';
import fs from 'fs';

export function createConnection() {
    const config = databaseConfig();
    return sql.execute(config.name, {
       query: `SELECT 1`
    });
}

export function fileExists(filePath) {
	return new Promise((resolve, reject) => {
		fs.access(filePath, fs.F_OK, (error) => {
			resolve(!error);
		});
	});
}

export function getDbMeta(snapshotName) {
	const config = databaseConfig();
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
	return sql.getPlainContext(config.name)
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
		});
}

export function bringOnline() {
	const config = databaseConfig();
	return sql.execute(config, {
		query: sql.fromFile('../../src/queries/bringOnline.sql'),
		params: {
			sourceDbName: Parameters.sourceDbName(config.database),
			query: Parameters.query,
		}
	});
}

export function deleteSnapshot(snapshotName) {
    const config = databaseConfig();
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
