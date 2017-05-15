SET @query = REPLACE(
	'ALTER DATABASE [{sourceDbName}] SET OFFLINE WITH ROLLBACK IMMEDIATE;',
	'{sourceDbName}',
	@sourceDbName);

EXEC(@query);
