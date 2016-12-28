export default class MssqlSnapshot {
    constructor(db) {
        this.db = db.retrieve();
        this.config = db.config;
    }
    testConnection() {
        return new Promise((resolve, reject) => {
            console.log(this.config);
            this.db.connect(this.config, (err) => {
                if (err) {
                    reject(new Error(""));
                } else {
                    resolve("Success!");
                }
            });
        });
    }
}

