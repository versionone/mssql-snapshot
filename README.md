# mssql-snapshot

[![Gitter](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/mssql-snapshot/)

A node module for creating and restoring mssql database snapshots.
For more information about snapshots, their purpose, and usage
please visit [Microsofts documentation site](https://msdn.microsoft.com/en-us/library/ms175158(v=sql.110).aspx).

## Configuration
mssql-snapshot module is written using the 
[seriate library](https://github.com/LeanKit-Labs/seriate) as a
dependency and therefore can use any its documented configuration structures
with the addition of a single property, `snapshotStoragePath`, to
indicate where you'd like to store the files for your snapshots.  A
typical configuration object can be constructed as such so that 
snapshot files are stored in `c:\snapshots\`.

```javascript
{
    name: 'mssql-snapshot-default',
    snapshotStoragePath: 'c:\\snapshots\\',
    user: 'mssqlTestUser',
    password: 'chickenLips5000',
    server: 'localhost',
    database: 'mssql-snapshot-testdb',
    pool: {
        max: 10,
        min: 0,
        idleTimeoutMillis: 30000
    }
}    
```
In order to be able to create SQL snapshots by any method,
standalone SQL script or otherwise, the service account that
SQL Server service runs under must have read/write privileges
to the local path mentioned on the *snapshotStoragePath* property
in the configuration object.  This will allow SQL Server to
write the files necessary to store the snapshots in
the directory mentioned.  There are many different
ways to accomplish this goal.  If you need guidance, see the
following resource:  https://msdn.microsoft.com/en-us/library/ms143504.aspx

## Usage

```javascript
npm install mssql-snapshot
```

```javascript
import MssqlSnapshot from 'mssql-snapshot';

const config = {
    name: 'mssql-snapshot-default',
    snapshotStoragePath: 'c:\\snapshots\\',
    user: 'mssqlTestUser',
    password: 'what_password',
    server: 'localhost',
    database: 'mssql-snapshot-testdb',
    pool: {
       max: 10,
       min: 0,
       idleTimeoutMillis: 30000
    }
}

const snapshot = new MssqlSnapshot(config);
snapshot.listAll(); //list existing snapshots for the current database
snapshot.connections(); //show existing connections to the current database excluding your own connection
snapshot.create('my-new-snapshot');  //create a new snapshot of the current database
snapshot.restore('my-existing-snapshot-name');  //restore from an existing snapshot
snapshot.delete('my-old-snapshot'); //delete an existing snapshot by name
```

##Examples
Methods available on MssqlSnapshot.js are promise based, meaning, they
can easily be chained together to achieve your goal of creating, deleting,
or reading a list of available SQL snapshots in many different ways.

As an example, you can choose to restore a snapshot only if there are no
extraneous connections to the source database.
```javascript
import { config } from 'mssql-snapshot';
import MssqlSnapshot from 'mssql-snapshot';

const snapshot = new MssqlSnapshot(config());

const getConnections = () => {
	return snapshot.connections().then(
	  (result) => if (results.length > 0) throw new Error('Connections exist!'),
	  (err) => throw new Error(err)
	);
}

const restoreSnapshot = () => {
	return snapshot.restore('mySnapshotName').then(
	  (result) => return result,
	  (err) => throw new Error(err)
	);
}

getConnections()
	.then(restoreSnapshot)
	.catch((err) => throw new Error(err));
```

## Important notes about restoring from a snapshot
When restoring from an existing snapshots using the .restore() method,
connections to the source database are killed by putting the
database in single user mode in order to facilitate the restore.
After the restore completes, normally withing seconds,
or if the restore fails, then the database is put back into multi-user mode.
The .connections() method can be used to manually check for existing connections
to the database prior to restoring if you do not want to impact a production
environment.

## Contributing
Work in progress and defect tracking is handled via trello at:  https://trello.com/b/03NEIEfs/mssql-snapshot.
If you find an issue, please use the trello board to see if it
is currently being handled.  If its not, please let us know of the issue
via trello, and also find the next priority card to pick up if
you are a developer considering contributing to the project.

If you'd like to contribute to the project, start by cloning the
repository, launching Sql Server Management Studio, and executing
the SQL script located in ./test/testSetup/createTestEnvironment.sql.
This will create a database and user for the integration tests to
run with.

Next, take a look at the configuration file located in
./src/databaseConfig.js. This file is key to configuring your
connection to the testing database.  Make any adjustments necessary
to fit your environment.

**IMPORTANT**:  See the configuration details above regarding the 
SQL Server service account configuration.  If the service
account does not have privileges to read/write from the path declared 
in ./src/databaseConfig.js *snapshotStoragePath*, the tests will fail
with errors related to the fact.

