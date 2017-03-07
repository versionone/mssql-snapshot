SET @query = 'ALTER DATABASE [{sourceDbName}] SET SINGLE_USER WITH ROLLBACK IMMEDIATE;'
SET @query = REPLACE(@query, '{sourceDbName}', @sourceDbName);
EXEC(@query);
