SET @query = REPLACE(
	'ALTER DATABASE [{sourceDbName}] SET ONLINE;',
	'{sourceDbName}',
	@sourceDbName);

EXEC(@query);
