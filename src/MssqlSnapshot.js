export default class MssqlSnapshot {
    constructor(database) {
        this.database = database;
        this.sqlMarshal = database.getSqlMarshal();
    }
    testConnection() {
        const marshal = this.sqlMarshal;
        return marshal.execute({
            query: marshal.fromFile('./queries/testConnection.sql')
        });
    }
    listSnapshots() {
        const db = this.database;
        const marshal = this.sqlMarshal;
        return marshal.execute({
            query: marshal.fromFile('./queries/listSnapshots.sql'),
            params: {
                sourceDbName: {
                    val: db.sourceDbName(),
                    type: marshal.NVARCHAR(50)
                }
            }
        });
    }
}

