import sql from 'mssql';

export default class Database {
    constructor(config){
        if (!config) throw new Error("No configuration supplied to orchestrate the connection interface.");
        this.config = config;
    }
    retrieve(){
        return sql;
    }
}
