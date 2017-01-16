import sql from 'seriate';
import databaseConfig from '../src/databaseConfig'

export function deleteSnapshot(snapshotName) {
    const config = databaseConfig();
    sql.addConnection(config);
    sql.execute(config.name, {
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