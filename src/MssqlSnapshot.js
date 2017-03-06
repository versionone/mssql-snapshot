import sql from 'seriate';

export default class MssqlSnapshot {
    constructor(config) {
        if (!config) throw new Error("No configuration supplied to orchestrate the connection interface.");
        this.config = config;
        sql.addConnection(this.config);
    }

    connections(connectionName = this.config.name) {
        return sql.execute(connectionName, {
            query: sql.fromFile('./queries/connections.sql'),
            params: {
                sourceDbName: {
                    val: this.config.database,
                    type: sql.NVARCHAR(50)
                }
            }
        });
    }

    listAll(connectionName = this.config.name) {
        return sql.execute(connectionName, {
            query: sql.fromFile('./queries/listSnapshots.sql'),
            params: {
                sourceDbName: {
                    val: this.config.database,
                    type: sql.NVARCHAR(50)
                }
            }
        });
    }

    _snapshotNameIsValid(snapshotName) {
        if (!snapshotName) throw new Error("No snapshot name supplied.");
        return true;
    }

    create(snapshotName, connectionName = this.config.name, snapshotStoragePath = this.config.snapshotStoragePath) {
        this._snapshotNameIsValid(snapshotName);
        const qualifiedPath = snapshotStoragePath + snapshotName;
        return sql.execute(connectionName, {
            query: sql.fromFile('./queries/createSnapshot.sql'),
            params: {
                query: {
                    val: '',
                    type: sql.VARCHAR(300)
                },
                sourceDbName: {
                    val: this.config.database,
                    type: sql.VARCHAR(50)
                },
                snapshotName: {
                    val: snapshotName,
                    type: sql.VARCHAR(50)
                },
                snapshotPath: {
                    val: qualifiedPath,
                    type: sql.VARCHAR(200)
                }
            }
        });
    }

    delete(snapshotName, connectionName = this.config.name) {
        this._snapshotNameIsValid(snapshotName);
        return sql.execute(connectionName, {
            query: sql.fromFile('../src/queries/deleteSnapshot.sql'),
            params: {
                snapshotName: {
                    val: snapshotName,
                    type: sql.VARCHAR(100)
                },
                query: {
                    val: '',
                    type: sql.VARCHAR(300)
                }
            }
        });
    }

    _setSingleUser(connectionName = this.config.name) {
        return sql.execute(connectionName, {
            query: `ALTER DATABASE [${this.config.database}] SET SINGLE_USER WITH ROLLBACK IMMEDIATE;`
        });
    }

    _setMultiUser(connectionName = this.config.name) {
        console.log('here');
        return sql.execute(connectionName, {
            query: `ALTER DATABASE [${this.config.database}] SET MULTI_USER;`
        });
    }

    restore(snapshotName, connectionName = this.config.name) {
        this._snapshotNameIsValid(snapshotName);
        const restore = () => {
            return sql.execute(connectionName, {
                query: sql.fromFile('../src/queries/restoreSnapshot.sql'),
                params: {
                    snapshotName: {
                        val: snapshotName,
                        type: sql.VARCHAR(100)
                    },
                    query: {
                        val: '',
                        type: sql.VARCHAR(300)
                    },
                    sourceDbName: {
                        val: this.config.database,
                        type: sql.NVARCHAR(50)
                    }
                }
            });
        };
        return this._setSingleUser(connectionName)
            .then(restore)
            .then(this._setMultiUser.bind(this, connectionName));
    }
}
