import sql from 'seriate';

export default class Database {
    constructor(config){
        if (!config) throw new Error("No configuration supplied to orchestrate the connection interface.");
        this.config = config;
    }
    getSqlMarshal(){
        sql.setDefault(this.config);
        return sql;
    }
    sourceDbName(){
        return this.config.database;
    }
}
