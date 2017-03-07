import sql from 'seriate';
import databaseConfig from '../src/databaseConfig'

export function createConnection() {
    const config = databaseConfig();
    sql.addConnection(config);
    return sql.execute(config.name, {
       query: `SELECT TABLE_NAME FROM [${config.database}].INFORMATION_SCHEMA.TABLES WHERE TABLE_TYPE = 'BASE TABLE'`
    });
}

export function deleteSnapshot(snapshotName) {
    const config = databaseConfig();
    sql.addConnection(config);
    return sql.execute(config.name, {
        query: sql.fromFile('../src/queries/deleteSnapshot.sql'),
        params: {
            snapshotName: Parameters.snapshotName(snapshotName),
            query: Parameters.query
        }
    });
}

export function createSnapshot(snapshotName) {
    const config = databaseConfig();
    sql.addConnection(config);
    return sql.execute(config.name, {
        query: sql.fromFile('../src/queries/createSnapshot.sql'),
        params: {
            query: Parameters.query,
            sourceDbName: Parameters.sourceDbName,
            snapshotName: Parameters.snapshotName(snapshotName),
            snapshotPath: Parameters.snapshotPath(snapshotName)
        }
    });
}