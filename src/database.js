import sql from 'mssql';
export default function(config){
    return (!config || config.isUnitTest === undefined || config.isUnitTest === false)
        ? sql
        : config.fakeDb;
}