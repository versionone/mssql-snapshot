
import sql from 'mssql';

export default class MssqlSnapshot {
    static testConnection(config) {
        return sql.connect(config).then((result) => new sql.Request().query("SELECT 'Succeeded' as CONNECTION"));
    }
}

