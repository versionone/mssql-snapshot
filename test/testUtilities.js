import sql from 'seriate';
import databaseConfig from '../src/databaseConfig'
import * as Parameters from '../src/Parameters';

export function createConnection() {
    const config = databaseConfig();
    return sql.execute(config.name, {
       query: `SELECT TABLE_NAME FROM [${config.database}].INFORMATION_SCHEMA.TABLES WHERE TABLE_TYPE = 'BASE TABLE'`
    });
}

export function killConnections() {
    const config = databaseConfig();
    return sql.execute(config, {
        query: sql.fromFile('../src/queries/killConnections.sql'),
        params: {
            sourceDbName: Parameters.sourceDbName,
            kill: sql.VARCHAR(8000),
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

export function createSnapshot(snapshotName) {
    const config = databaseConfig();
    return sql.execute(config, {
        query: sql.fromFile('../src/queries/createSnapshot.sql'),
        params: {
            query: Parameters.query,
            sourceDbName: Parameters.sourceDbName,
            snapshotName: Parameters.snapshotName(snapshotName),
            snapshotPath: Parameters.snapshotPath(snapshotName)
        }
    });
}
