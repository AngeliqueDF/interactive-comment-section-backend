const path = require("path");
const { db } = require(path.resolve(__dirname, "./connectDatabase.js"))();

// Create comments table
const createCommentsTable = () => `
  CREATE TABLE comments (
    id INTEGER PRIMARY KEY,
    content TEXT NOT NULL,
    createdAt TEXT NOT NULL,
    score INTEGER DEFAULT 0,
    user INTEGER NOT NULL,
    replyingToComment INTEGER DEFAULT NULL,
    replyingToUser INTEGER DEFAULT NULL,
    FOREIGN KEY(user) REFERENCES users(id),
    FOREIGN KEY(replyingToComment) REFERENCES comments(id),
    FOREIGN KEY(replyingToUser) REFERENCES users(id)
  );`;

// Create comments votes table
const createCommentVotesTable = () => `CREATE TABLE comment_votes(
  id INTEGER PRIMARY KEY,
  comment_id INTEGER NOT NULL,
  user_id INTEGER NOT NULL,
  vote_given TEXT NOT NULL
)`;
module.exports = {
  createCommentsTable,
  createCommentVotesTable,
};
