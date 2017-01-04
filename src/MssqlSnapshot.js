export default class MssqlSnapshot {
    constructor(database) {
        this.database = database.retrieve();
    }
    testConnection() {
        return this.database.execute({
            query: this.database.fromFile('./queries/testConnection.sql')
        });
    }
        });
    }
}

