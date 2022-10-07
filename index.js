const path = require("path");
const setupDatabase = require(path.resolve(__dirname, "./setupDatabase"));

const http = require("http");
const app = require("./app");
const server = http.createServer(app);

server.listen(process.env.PORT || 5000, async () => {
	console.log(`Server running on port ${process.env.PORT || 5000}`);
	console.log("Please wait while the database is created");

	await setupDatabase.createDatabase();
});

module.exports = server;
