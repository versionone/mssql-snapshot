import MssqlSnapshot from './MssqlSnapshot';

export default (config) => cb => {
	const connection = new MssqlSnapshot(config);
	return connection.connect()
		.then(() => cb({
			connections,
			create,
			restore,
			listAll,
			delete: deleteSnapshot,
		}))
		.then(connection.closeConnection);
};

function connections() {

}

function create() {

}

function restore() {

}

function listAll() {

}

function deleteSnapshot() {

}
