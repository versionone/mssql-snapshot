import MssqlSnapshot from './MssqlSnapshot';

export default (config) => cb => {
	const connection = new MssqlSnapshot(config);
	return connection.connect()
		.then(() => cb({
			connections: connection._connections,
			create: connection._create,
			restore: connection._restore,
			listAll: connection._listAll,
			delete: connection._delete,
		}))
		.then(connection.closeConnection);
};
