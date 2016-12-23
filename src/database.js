import sql from 'mssql';
export default function(config){
    return config.isUnitTest === false ? sql : config.fakeDb;
}