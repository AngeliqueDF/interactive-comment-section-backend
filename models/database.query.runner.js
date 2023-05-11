// TODO rename to RunDatabaseQueries
/**
 * Prepares and runs database statements. Resolves or rejects depending on the success/failure of queries.
 */

const path = require("path");
const db = require(path.resolve(
	__dirname,
	"./database.connection.js"
)).connectDatabase();

function runPreparedStatement(sqlQuery, parameters) {
	return new Promise(function (resolve, reject) {
		const statement = db.prepare(sqlQuery);
		statement.run(parameters, function (err) {
			if (err) {
				reject(err);
			}
			resolve(this.lastID);
			statement.finalize();
		});
	});
}

function get(sqlQuery) {
	return new Promise(function (resolve, reject) {
		db.all(sqlQuery, function (err, rows) {
			if (err) {
				reject(err);
			}
			resolve(rows);
		});
	});
}

function getParameterized(sqlQuery, parameters) {
	return new Promise(function (resolve, reject) {
		db.all(sqlQuery, parameters, function (err, row) {
			if (err) {
				reject(err);
			}
			resolve(row);
		});
	});
}

module.exports = {
	insert: runPreparedStatement,
	getParameterized,
	get: getParameterized,
	update: runPreparedStatement,
	delete: runPreparedStatement,
};
