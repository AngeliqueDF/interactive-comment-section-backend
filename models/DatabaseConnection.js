// TODO rename to DatabaseConnection
/**
 * Connects to the database specified in databasePath.
 * If the value isn't defined, databasePath's value is determined using process.env.NODE_ENV environment variable.
 */

const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const setDatabasePath = (customPath) => {
	if (customPath) return customPath;

	const ENVIRONMENTS_MAP = {
		production: "database.sqlite",
		development: "development-database.sqlite",
		util: "util-database.sqlite",
		test: "tdd-tests-database.sqlite",
	};

	return ENVIRONMENTS_MAP[process.env.NODE_ENV];
};

function connectDatabase(DATABASE_PATH) {
	const databasePath = setDatabasePath(DATABASE_PATH);
	return new sqlite3.Database(path.resolve(__dirname, databasePath), (err) => {
		if (err) {
			console.log(err);
		}
	});
}

module.exports = {
	connectDatabase,
};
