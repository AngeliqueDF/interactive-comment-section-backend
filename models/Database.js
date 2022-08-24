const path = require("path");
const { db } = require(path.resolve(__dirname, "./connectDatabase.js"))();

function runPreparedStatement(sqlQuery, parameters) {
	const statement = db.prepare(sqlQuery);
	statement.run(parameters, async function (err) {
		if (err) {
			console.log("database error", err);
			return err;
		}
		console.log("no error", "this.lastID", this.lastID);
		// console.log(this);
		let result;
		result = await this.lastID;
		console.log("result", result);
		return result;
	});

	statement.finalize();
}
function runQuery(sqlQuery) {
	db.run(sqlQuery);
}

module.exports = {
	runPreparedStatement,
	addOne: runPreparedStatement,
};
