const path = require("path");
const { db } = require(path.resolve(
	__dirname,
	"./models/connectDatabase.js"
))();

console.log("index.js");

const Comment = require("./models/comment");
const User = require("./models/user");

const http = require("http");
const app = require("./app");
const server = http.createServer(app);
server.listen(5000, () => {
  console.log(`Server running on port ${5000}`);
  console.log("Please wait while the database is created");

  db.serialize(() => {
    db.run("DROP TABLE IF EXISTS comments;");
    db.run("DROP TABLE IF EXISTS comment_votes;");
    db.run("DROP TABLE IF EXISTS users;");

    db.run(User.createUsersTable(), (err) => {
      if (err) {
        console.log(err);
      }
      console.log("\x1b[34m", "Table users created");
    });

    db.run(Comment.createCommentsTable(), (err) => {
      if (err) {
        console.log(err);
      }
      console.log("\x1b[34m", "Table comments created");
    });

    db.run(Comment.createCommentVotesTable(), (err) => {
      if (err) {
        console.log(err);
      }
      console.log("\x1b[34m", "Table comments_votes created");
    });

  });
});
