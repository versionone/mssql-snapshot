import sql from 'seriate';
import databaseConfig from '../src/databaseConfig'
import * as Parameters from '../src/Parameters';
import path from 'path';

export function createConnection() {
    const config = databaseConfig();
    return sql.execute(config.name, {
       query: `SELECT 1 as 'Connection'`
    });
}

export function getPhysicalPath(sourceDbName, snapshotName) {
	const config = databaseConfig();
	return sql.execute(config, {
		query: sql.fromFile('../src/queries/getPhysicalPath.sql'),
		params: {
			sourceDbName: Parameters.sourceDbName(sourceDbName),
		}
	}).then((result) => path.join(path.dirname(result[0].filename), snapshotName));
}

export function killConnections() {
    const config = databaseConfig();
	return sql.getPlainContext(config.name)
		.step("bringOffline", {
			query: sql.fromFile('../src/queries/bringOffline.sql'),
			params: {
				sourceDbName: Parameters.sourceDbName(config.database),
				query: Parameters.query,
			}
		})
		.step("bringOnline", {
			query: sql.fromFile('../src/queries/bringOnline.sql'),
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
		query: sql.fromFile('../src/queries/bringOnly.sql'),
		params: {
			sourceDbName: Parameters.sourceDbName(this.config.database),
			query: Parameters.query,
		}
	});
}

export function deleteSnapshot(snapshotName) {
    const config = databaseConfig();
    return sql.execute(config, {
        query: sql.fromFile('../src/queries/deleteSnapshot.sql'),
        params: {
            snapshotName: Parameters.snapshotName(snapshotName),
            query: Parameters.query
        }
    });
}

export function createSnapshot(snapshotName, snapshotStoragePath) {
    const config = databaseConfig();
    return sql.execute(config, {
        query: sql.fromFile('../src/queries/createSnapshot.sql'),
        params: {
            query: Parameters.query,
            sourceDbName: Parameters.sourceDbName(config.database),
            snapshotName: Parameters.snapshotName(snapshotName),
            snapshotPath: Parameters.snapshotPath(snapshotStoragePath)
        }
    });
}
