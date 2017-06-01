SET @query = REPLACE(
	'CREATE DATABASE [{snapshotName}] ON (NAME=[{logicalName}],FILENAME=''{snapshotPath}'') AS SNAPSHOT OF [{sourceDbName}];',
	'{sourceDbName}',
	@sourceDbName);
SET @query = REPLACE(@query, '{logicalName}', @logicalName);
SET @query = REPLACE(@query, '{snapshotName}', @snapshotName);
SET @query = REPLACE(@query, '{snapshotPath}', @snapshotPath);

EXEC(@query);

SELECT @snapshotName + ' was successfully created.' as 'Success';
