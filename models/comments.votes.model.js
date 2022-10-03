const path = require("path");
const Database = require(path.resolve(__dirname, "./database.query.runner"));

/**
 * Create comments votes table. The table is used to keep track of the current user's comment votes.
 */
const CREATE_COMMENTS_VOTES_TABLE_QUERY = `
CREATE TABLE comments_votes (
  id INTEGER PRIMARY KEY,
  comment_id INTEGER NOT NULL,
  user_id INTEGER NOT NULL,
  vote_given TEXT NOT NULL
);`;


/**
 * TODO Add one point to the score of a comment.
 */

/**
 * TODO Remove one point to the score of a comment.
 */

/**
 * TODO Select all votes made by a given user.
 */
const GET_ALL_USER_COMMENTS_VOTES = `SELECT comment_id, vote_given FROM comments_votes WHERE user_id = ?;`;

/**
 * Drop comment votes table
 */
const DROP_COMMENTS_VOTES_TABLE_QUERY = "DROP TABLE IF EXISTS comments_votes;";

module.exports = {
	CREATE_COMMENTS_VOTES_TABLE_QUERY,
	insertOne: async function (parameters) {
		const addCommentResult = await Database.addOne(
			NEW_COMMENT_QUERY,
			parameters
		);
		return addCommentResult;
	},
	getAllByUser: async function (userID) {
		const userVotes = await Database.getById(
			GET_ALL_USER_COMMENTS_VOTES,
			userID
		);

		return userVotes;
	},
	DROP_COMMENTS_VOTES_TABLE_QUERY,
};
