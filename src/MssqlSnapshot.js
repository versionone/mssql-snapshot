import sql from 'seriate';

export default class MssqlSnapshot {
    constructor(config){
        if (!config) throw new Error("No configuration supplied to orchestrate the connection interface.");
        this.config = config;
        sql.addConnection(this.config);
    }
    listAll(connectionName = this.config.name){
        return sql.execute(connectionName, {
            query: sql.fromFile('./queries/listSnapshots.sql'),
            params: {
                sourceDbName: {
                    val: this.config.database,
                    type: sql.NVARCHAR(50)
                }
            }
        });
    }

    create(snapshotName, connectionName = this.config.name, snapshotStoragePath = this.config.snapshotStoragePath) {
        if (!snapshotName) throw new Error("No snapshot name supplied.");
        const qualifiedPath = snapshotStoragePath + snapshotName;
        return sql.execute(connectionName, {
            query: sql.fromFile('./queries/createSnapshot.sql'),
            params: {
                query: {
                    val: '',
                    type: sql.VARCHAR(300)
                },
                sourceDbName: {
                    val: this.config.database,
                    type: sql.VARCHAR(50)
                },
                snapshotName: {
                    val: snapshotName,
                    type: sql.VARCHAR(50)
                },
                snapshotPath: {
                    val: qualifiedPath,
                    type: sql.VARCHAR(200)
                }
            }
        });
    }
}
