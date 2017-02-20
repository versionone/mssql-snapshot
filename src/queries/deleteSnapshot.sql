IF EXISTS(SELECT NULL FROM sys.databases WHERE [Name] = @snapshotName AND [source_database_id] IS NOT NULL)
	BEGIN
		SET @query = 'DROP DATABASE [' + @snapshotName + '];'
		EXEC(@query);
		SELECT @snapshotName + ' was successfully deleted.' as 'Success';
	END
ELSE
	BEGIN
		SELECT REPLACE('When attempting to delete {snapshotName}, the snapshot was not found.', '{snapshotName}', @snapshotName) as 'Failure';
	END