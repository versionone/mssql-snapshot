SET @query = 'ALTER DATABASE [{sourceDbName}] SET MULTI_USER;'
SET @query = REPLACE(@query, '{sourceDbName}', @sourceDbName);
EXEC(@query);