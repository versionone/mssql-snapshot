USE MASTER;
IF EXISTS(SELECT NULL FROM sys.databases WHERE [Name] = @snapshotName AND [source_database_id] IS NOT NULL)
	BEGIN
		SET @query = 'RESTORE DATABASE [{sourceDbName}] FROM DATABASE_SNAPSHOT = ''{snapshotName}'';'
		SET @query = REPLACE(@query, '{sourceDbName}', @sourceDbName);
		SET @query = REPLACE(@query, '{snapshotName}', @snapshotName);
		EXEC(@query);
		SELECT @snapshotName + ' was successfully restored.' as 'Success';
	END
ELSE
	BEGIN
		SELECT REPLACE('When attempting to restore from {snapshotName}, the snapshot was missing.', '{snapshotName}', @snapshotName) as 'Failure';
	END