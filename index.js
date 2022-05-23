const sqlite3 = require("sqlite3").verbose();
const path = require("path");
const db = new sqlite3.Database(
  path.resolve(__dirname, "./database.sqlite"),
  (err) => {
    if (err) {
      console.log(err);
    }
  }
);

const User = require("./models/user");
const http = require("http");
const app = require("./app");
const server = http.createServer(app);
server.listen(5000, () => {
  console.log(`Server running on port ${5000}`);
  console.log("Please wait while the database is created");

  db.serialize(() => {
    db.run("DROP TABLE IF EXISTS users;");

    db.run(User.createUsersTable(), (err) => {
      if (err) {
        console.log(err);
      }
      console.log("\x1b[34m", "Table users created");
    });
  });
});
