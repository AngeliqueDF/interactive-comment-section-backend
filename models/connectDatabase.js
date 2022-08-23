const sqlite3 = require("sqlite3").verbose();
const path = require("path");

/**
 * Connect to the correct .sqlite database depending on the current environment, and whether a database filename was provided.
 * @param {string} databasePath
 */
module.exports = function DatabaseConnection(
	databasePath = process.env.NODE_ENV === "development" ||
	process.env.NODE_ENV === "production"
		? "./database.sqlite"
		: "./tdd-tests-database.sqlite"
) {
	return {
		db: new sqlite3.Database(path.resolve(__dirname, databasePath), (err) => {
			if (err) {
				console.log(err);
			}
		}),
	};
};
