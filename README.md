# mssql-snapshot

[![Gitter](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/mssql-snapshot/)

A node module for creating and restoring mssql database snapshots.
For more information about snapshots, their purpose, and usage
please visit [Microsofts documentation site](https://msdn.microsoft.com/en-us/library/ms175158(v=sql.110).aspx).

## Usage

```javascript
npm install mssql-snapshot
```

```javascript
import { config } from 'mssql-snapshot';
import MssqlSnapshot from 'mssql-snapshot';

const snapshot = new MssqlSnapshot(config());
snapshot.listAll(); //list existing snapshots for the current database
snapshot.connections(); //show existing connections to the current database excluding your own connection
snapshot.create('my-new-snapshot');  //create a new snapshot of the current database
snapshot.restore('my-existing-snapshot-name');  //restore from an existing snapshot
snapshot.delete('my-old-snapshot'); //delete an existing
```

## Important notes about restoring from a snapshot
When restoring from an existing snapshots, connections to the source database
are killed by putting the database in single user mode in order to
facilitate the restore.  After the restore completes, normally withing seconds,
or if the restore fails, then the database is put back into multi-user mode.

## Contributing
If you'd like to contribute to the project, start by cloning the
repository, launching Sql Server Management Studio, and executing
the SQL script located in ./test/testSetup/createTestEnvironment.sql.
This will create a database and user for the integration tests to
run with.

Next, take a look at the configuration file located in ./src/databaseConfig.js.  This file is key to
configuring your connection to the testing database.  Make any adjustments
necessary to fit your environment.  **IMPORTANT**:  See the configuration details
below regarding the SQL Server service account configuration.  If the service
account does not have privileges to read/write from the path declared in
./src/databaseConfig.js *snapshotStoragePath*, the tests will fail with errors
 related to the fact.

##Configuration

In order for all of the tests to succeed if you're contributing, and for the
module to work properly in production, the service account that SQL Server service runs under must have read/write privileges to the local
path mentioned on the *snapshotStoragePath* property in the databaseConfig.js file.
This will allow SQL Server to write the files necessary to store the snapshots in
the directory mentioned.  Without the proper privileges, the integration test will
fail and the module will not be able to write the appropriate files to disk
in order to successfully create snapshots and restore from them.  There are
many different ways to accomplish this goal and if you need guidance.
