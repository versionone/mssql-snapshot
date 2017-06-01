SET @query = REPLACE(
	'USE [{sourceDbName}];' +
	'SELECT [name] AS LogicalName, physical_name AS PhysicalName ' +
	'FROM sys.database_files WHERE type_desc != ''LOG'';',
	'{sourceDbName}',
	@sourceDbName);

EXEC(@query);
