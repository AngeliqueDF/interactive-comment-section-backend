const path = require("path");
const Database = require(path.resolve(__dirname, "./DatabaseQueryRunner"));

// Create comments table
const CREATE_COMMENTS_TABLE_QUERY = `
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
const CREATE_COMMENT_VOTES_TABLE_QUERY = `CREATE TABLE comment_votes(
  id INTEGER PRIMARY KEY,
  comment_id INTEGER NOT NULL,
  user_id INTEGER NOT NULL,
  vote_given TEXT NOT NULL
)`;
/**
 * Add a new comment
 */
const NEW_COMMENT_QUERY = `INSERT INTO comments (user, content, createdAt, score,  replyingToComment, replyingToUser) VALUES (?, ?, ?, ?, ?, ?)`;

// Drop comments table
const DROP_COMMENTS_TABLE_QUERY = "DROP TABLE IF EXISTS comments;";

// Drop comment votes table
const DROP_COMMENT_VOTES_TABLE_QUERY = "DROP TABLE IF EXISTS comment_votes;";

module.exports = {
	CREATE_COMMENTS_TABLE_QUERY,
	CREATE_COMMENT_VOTES_TABLE_QUERY,
	insertOne: async function (parameters) {
		const addCommentResult = await Database.addOne(
			NEW_COMMENT_QUERY,
			parameters
		);
		return addCommentResult;
	},
	DROP_COMMENTS_TABLE_QUERY,
	DROP_COMMENT_VOTES_TABLE_QUERY,
};
