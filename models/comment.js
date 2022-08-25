const path = require("path");

const Database = require(path.resolve(__dirname, "./Database"));
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
/**
 * Add a new comment
 */
const NEW_COMMENT_QUERY = `INSERT INTO comments (user, content, createdAt, score,  replyingToComment, replyingToUser) VALUES (?, ?, ?, ?, ?, ?)`;

// Drop comments table
const dropCommentsTable = () => "DROP TABLE IF EXISTS comments;";

// Drop comment votes table
const dropCommentsVotesTable = () => "DROP TABLE IF EXISTS comment_votes;";

module.exports = {
	createCommentsTable,
	createCommentVotesTable,
	insertOne: async function (parameters) {
		const addCommentResult = await Database.addOne(
			NEW_COMMENT_QUERY,
			parameters
		);
		return addCommentResult;
	},
	getAllCommentsQuery,
	dropCommentsTable,
	dropCommentsVotesTable,
};
