SELECT filename
FROM master.dbo.sysdatabases
WHERE name = @sourceDbName;
