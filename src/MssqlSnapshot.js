export default class MssqlSnapshot {
    constructor(database) {
        this.database = database.retrieve();
    }
    testConnection() {
        return this.database.execute({
            query: this.database.fromFile('./queries/testConnection.sql')
        });
    }
    listSnapshots() {
        return this.database.execute({
            query: this.database.fromFile('./queries/listSnapshots.sql'),
            params: {
                sourceDbName: {
                    val: this.database.sourceDbName,
                    type: this.database.NVARCHAR(50)
                }
            }
        });
    }
}

