const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const db = new sqlite3.Database(
	path.resolve(__dirname, "./test-database.sqlite"),
	(err) => {
		if (err) {
			console.log(err);
		}
	}
);

module.exports = {
	db,
};
