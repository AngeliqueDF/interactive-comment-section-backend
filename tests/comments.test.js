const path = require("path");
const db = require(path.resolve(
	__dirname,
	"./../models/DatabaseConnection"
)).connectDatabase();

const supertest = require("supertest");
const app = require("../app");
const api = supertest(app);

const Comment = require(path.resolve(__dirname, "./../models/comment"));

const API_URL = "/api/comments";

// Mock the Date object. Will be used to check an instance of Date was created
const spy = jest.spyOn(global, "Date");

describe('GET "/api/comments"', () => {
	afterEach(() => {
		db.run(`DELETE FROM comments;`);
	});

			try {
				const addedComment = await Comment.insertOne([
					comment.user,
					comment.content,
					comment.createdAt,
					comment.score,
					comment.replyingToComment,
					comment.replyingToUser,
				]);
			} catch (error) {
				console.log(error);
			}
		});

	});

	test("Returns all comments in the database", async () => {
		const response = await api
			.get(API_URL)
			.expect(200)
			.expect("Content-Type", /application\/json/);

		expect(response.body).toHaveLength(INITIAL_COMMENTS.length);
	});
});

describe.only('POST "/api/comments/newComment"', () => {
	const ROUTE = API_URL + "/newComment";

	afterEach(() => {
		// Empty the database after each test
		db.run(`DELETE FROM comments;`);
	});

	const VALID_NEW_COMMENT = {
		content: "A new comment with all fields.",
		user: 2,
	};

	test("Return the correct response when all required fields are provided.", async () => {
		const response = await api
			.post(ROUTE)
			.send({
				newComment: VALID_NEW_COMMENT,
			})
			.expect(201)
			.expect("Content-Type", /application\/json/);

		expect(response.body.content).toEqual(VALID_NEW_COMMENT.content);
		expect(response.body.user).toEqual(VALID_NEW_COMMENT.user);
		expect(response.body.createdAt).toBeDefined();
		expect(spy).toHaveBeenCalled(); // Check new Date() was called. createdAt will evaluate to '[object Object]' in the database, and mockConstructor {} in the response body. Which is normal because the Date constructor is being mocked.
		expect(response.body.replyingToComment).toBeNull();
		expect(response.body.replyingToUser).toBeNull();
	});

	test("Return an error response when the content is missing", async () => {
		const response = await api
			.post(ROUTE)
			.send({ newComment: { user: 1 } })
			.expect(400)
			.expect("Content-Type", /application\/json/);
		expect(response.body.error).toBe("Missing required field(s).");
	});
});

describe.only('POST "/api/comments/newReply"', () => {
	const ROUTE = API_URL + "/newReply";

	afterEach(() => {
		// Empty the database after each test
		db.run(`DELETE FROM comments;`);
	});

	test("Returns the correct information on the comment getting replied to .", async () => {
		const DATA = [
			{
				id: 1,
				content: "first comment",
				createdAt: new Date(),
				score: 12,
				user: 1,
				replies: [],
				replyingToUser: null,
				replyingToComment: null,
			},
			{
				id: 2,
				content: "second comment",
				user: 2,
				createdAt: new Date(),
				score: 9,
				replies: [],
				replyingToComment: 1,
				replyingToUser: 1,
			},
		];

		const response = await api
			.post(ROUTE)
			.send({
				allComments: DATA,
				newComment: {
					content: "Replies to comment 2, but its root comment's id is 1.",
					user: 1,
					replyingToComment: 2,
					replyingToUser: 2,
					replyingToAuthor: "@username ",
				},
			})
			.expect(201)
			.expect("Content-Type", /application\/json/);

		expect(response.body.replyingToComment).toBe(1);
		expect(response.body.replyingToUser).toBe(2);
	});
});
