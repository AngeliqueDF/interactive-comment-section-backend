const path = require("path");

// Setup database
const setupDatabase = require(path.resolve(__dirname, "./../setupDatabase"));

const supertest = require("supertest");
const app = require("./../app");
const api = supertest(app);

const CommentsModel = require(path.resolve(
	__dirname,
	"./../models/comments.model"
));
const CommentsVotesModel = require(path.resolve(
	__dirname,
	"./../models/comments.votes.model"
));

const API_URL = "/api/comments";

jest.retryTimes(3);

beforeEach(() => {
	return setupDatabase.createDatabase();
}, 20000);

afterEach(() => {
	// Empty the database after each test
	return setupDatabase.clearDatabase();
}, 20000);

describe.only('POST "/api/comments/votes/increment"', () => {
	const ROUTE = API_URL + "/votes/increment";

	test("Increments the score of a comment", async () => {
		const DATA = [
			{
				user: 1,
				content: "This comment will receive a vote to increment its score.",
				score: 12,
				replyingToUser: null,
				replyingToComment: null,
			},
		];

		DATA.forEach(async (comment) => {
			try {
				const addedComment = await CommentsModel.insertOne([
					comment.user,
					comment.content,
					comment.score,
					comment.replyingToComment,
					comment.replyingToUser,
				]);
			} catch (error) {
				console.log(error);
			}
		});

		const response = await api
			.post(ROUTE)
			.expect(201)
			.send({
				newVote: { commentID: 1, currentUser: 1, voteGiven: "INCREMENT" },
			})
			.auth(
				process.env.REACT_APP_CLIENT_ID,
				process.env.REACT_APP_CLIENT_SECRET
			)
			.expect("Content-Type", /application\/json/);

		// Check the comments_votes database was properly updated
		const addedVote = await CommentsVotesModel.getOne([1, 1]);
		expect(addedVote).toHaveLength(1);
	});

});
