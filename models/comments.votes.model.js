const path = require("path");
const Database = require(path.resolve(__dirname, "./database.query.runner"));

/**
 * Create comments votes table. The table is used to keep track of the current user's comment votes.
 */
const CREATE_COMMENTS_VOTES_TABLE_QUERY = `
CREATE TABLE IF NOT EXISTS comments_votes (
  id INTEGER PRIMARY KEY,
  comment_id INTEGER NOT NULL,
  user_id INTEGER NOT NULL,
  vote_given TEXT NOT NULL
);`;

const ADD_COMMENT_VOTE_QUERY = `
INSERT INTO comments_votes (
	comment_id,
	user_id,
	vote_given
) 
VALUES (?, ?, ?);
`;

/**
 * TODO Select all votes made by a given user.
 */
const GET_ALL_USER_COMMENTS_VOTES = `SELECT comment_id, vote_given FROM comments_votes WHERE user_id = ?;`;

/**
 * TODO Find whether the current user has already voted for a specific command. Used when they are attempting to vote for any comment.
 */
const GET_SPECIFIC_COMMENT_VOTE_BY_USER_ID = `
SELECT comment_id
FROM comments_votes
WHERE user_id = ?;`;

const GET_SPECIFIC_COMMENT_VOTE_QUERY = `
SELECT id, vote_given, user_id
FROM comments_votes
	WHERE user_id = ? AND comment_id = ?
;`;

/**
 * Drop comment votes table
 */
const DROP_COMMENTS_VOTES_TABLE_QUERY = "DROP TABLE IF EXISTS comments_votes;";

module.exports = {
	CREATE_COMMENTS_VOTES_TABLE_QUERY,
	insertOne: async function (parameters) {
		const addVoteResult = await Database.addOne(
			ADD_COMMENT_VOTE_QUERY,
			parameters
		);
		return addVoteResult;
	},
	getAllByUser: async function (userID) {
		const userVotes = await Database.getById(
			GET_ALL_USER_COMMENTS_VOTES,
			userID
		);

		return userVotes;
	},
	DROP_COMMENTS_VOTES_TABLE_QUERY,
	getOne: async function (parameters) {
		const commentFound = await Database.getById(
			GET_SPECIFIC_COMMENT_VOTE_BY_USER_ID,
			parameters
		);
		return commentFound;
	},
	getOne: async function (parameters) {
		const voteFound = await Database.getById(
			GET_SPECIFIC_COMMENT_VOTE_QUERY,
			parameters
		);
		return voteFound;
	},
};
