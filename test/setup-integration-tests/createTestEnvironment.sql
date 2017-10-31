USE MASTER;
GO

--kill connections to the db and associated snapshots
DECLARE @SQL varchar(max)
SELECT @SQL = COALESCE(@SQL,'') + 'Kill ' + Convert(varchar, SPId) + ';'
FROM MASTER..SysProcesses
WHERE DBId LIKE DB_ID(N'mssql-snapshot-test%') AND SPId <> @@SPId
EXEC(@SQL);

WHILE EXISTS(select NULL from sys.databases where name='mssql-snapshot-testdb')
BEGIN
    DROP DATABASE [mssql-snapshot-testdb];
END
GO

CREATE DATABASE [mssql-snapshot-testdb];
GO

If NOT EXISTS (SELECT loginname FROM master.dbo.syslogins WHERE name = 'mssqlTestUser')
BEGIN
	CREATE LOGIN mssqlTestUser WITH PASSWORD = ',y#&$p2rYQ8VR?}&';
	EXEC master..sp_addsrvrolemember @loginame = N'mssqlTestUser', @rolename = N'sysadmin';
END