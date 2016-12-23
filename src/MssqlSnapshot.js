export default class MssqlSnapshot {
    constructor(db) {
        this.db = db;
    }
    testConnection(config) {
        return new Promise((resolve, reject)=> {
            try{
                resolve(this.db.connect(config).then((result) => new this.db.Request().query("SELECT 'Succeeded' as CONNECTION")));
            }
            catch(error) {
                reject(error);
            }
        });
    }
}

