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
            snapshotName: {
                val: snapshotName,
                type: sql.VARCHAR(100)
            },
            query: {
                val: '',
                type: sql.VARCHAR(300)
            }
        }
    });
}

export function createSnapshot(snapshotName) {
    const config = databaseConfig();
    sql.addConnection(config);
    return sql.execute(config.name, {
        query: sql.fromFile('../src/queries/createSnapshot.sql'),
        params: {
            query: {
                val: '',
                type: sql.VARCHAR(300)
            },
            sourceDbName: {
                val: config.database,
                type: sql.VARCHAR(50)
            },
            snapshotName: {
                val: snapshotName,
                type: sql.VARCHAR(50)
            },
            snapshotPath: {
                val: config.snapshotStoragePath + snapshotName,
                type: sql.VARCHAR(200)
            }
        }
    });
}