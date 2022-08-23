const path = require("path");
const DatabaseConnection = require(path.resolve(
	__dirname,
	"./connectDatabase"
));

module.exports = function UtilityDatabaseConnection() {
	// Initialize a connection to the utility database
	const { db } = DatabaseConnection("utils-test-database.sqlite");

	// Export the db object will all the methods needed to use the database
	return db;
};
