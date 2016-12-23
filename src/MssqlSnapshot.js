import database from './database';

export default class MssqlSnapshot {
    constructor(config) {
        this.db = database(config);
    }

    testConnection() {
        return new Promise((resolve, reject) => {
            try {
                resolve(this.db.connect(this.config).then((result) => new this.db.Request().query("SELECT 'Succeeded' as CONNECTION")));
            }
            catch (error) {
                reject(error);
            }
        });
    }
}

