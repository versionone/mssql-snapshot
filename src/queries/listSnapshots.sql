USE MASTER
SELECT SourceDB.[name] AS SourceDatabase, SnapshotDB.[name] AS SnapshotDatabase, SnapshotDB.Create_Date AS DateOfCreation
FROM sys.databases SourceDB
INNER JOIN sys.databases SnapshotDB ON SourceDB.database_id = SnapshotDB.source_database_id