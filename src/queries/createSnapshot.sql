SET @query = REPLACE(
	'CREATE DATABASE [{snapshotName}] ON (NAME=[{sourceDbName}],FILENAME=''{snapshotPath}'') AS SNAPSHOT OF [{sourceDbName}];',
	'{sourceDbName}',
	@sourceDbName);
SET @query = REPLACE(@query, '{snapshotName}', @snapshotName);
SET @query = REPLACE(@query, '{snapshotPath}', @snapshotPath);

EXEC(@query);

SELECT @snapshotName + ' was successfully created.' as 'Success';