export default class MssqlSnapshot {
    constructor(database) {
        this.database = database.retrieve();
        this.config = database.config;
    }
    testConnection() {
        return new Promise((resolve, reject) => {
            this.database.connect(this.config, (err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve("Success!");
                }
            });
        });
    }
}

