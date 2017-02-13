IF EXISTS(SELECT NULL FROM sys.databases WHERE [Name] = @snapshotName AND [source_database_id] IS NOT NULL)
BEGIN
	SET @query = 'DROP DATABASE [' + @snapshotName + '];'
	EXEC(@query);
END