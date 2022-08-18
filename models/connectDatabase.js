const sqlite3 = require("sqlite3").verbose();
const path = require("path");

/**
 * Connect to the .sqlite database.
 * @param {string} databasePath By default, "./database.sqlite" in the root folder.
 */
module.exports = function DatabaseConnection(
	databasePath = "./database.sqlite"
) {
	return {
		db: new sqlite3.Database(path.resolve(__dirname, databasePath), (err) => {
			if (err) {
				console.log(err);
			}
		}),
	};
};
