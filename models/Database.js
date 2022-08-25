const path = require("path");
const { db } = require(path.resolve(__dirname, "./connectDatabase.js"))();

function runPreparedStatement(sqlQuery, parameters) {
	return new Promise(function (resolve, reject) {
		const statement = db.prepare(sqlQuery);
		statement.run(parameters, function (err) {
			if (err) {
				reject(err);
			}
			resolve(this.lastID);
		});
	});

	statement.finalize();
}
function runQuery(sqlQuery) {
	db.run(sqlQuery);
}

module.exports = {
	addOne: runPreparedStatement,
};
