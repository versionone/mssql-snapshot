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
}
