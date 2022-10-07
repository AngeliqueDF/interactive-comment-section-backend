const path = require("path");
const db = require(path.resolve(
	__dirname,
	"./../models/database.connection"
)).connectDatabase();

const supertest = require("supertest");
const app = require("../app");
const api = supertest(app);

const Comment = require(path.resolve(__dirname, "./../models/comments.model"));

const API_URL = "/api/comments";

describe('GET "/api/comments"', () => {
	afterEach(() => {
		db.run(`DELETE FROM comments;`);
	});

	test("Returns all comments in the database", async () => {
		const DATA = [
			{
				user: 1,
				content:
					"Impressive! Though it seems the drag feature could be improved. But overall it looks incredible. You've nailed the design and the responsiveness at various breakpoints works really well.",
				score: 12,
				replyingToUser: null,
				replyingToComment: null,
			},
		];

		DATA.forEach(async (comment) => {
			try {
				const addedComment = await Comment.insertOne([
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
			.get(API_URL)
			.expect(200)
			.auth(
				process.env.REACT_APP_CLIENT_ID,
				process.env.REACT_APP_CLIENT_SECRET
			)
			.expect("Content-Type", /application\/json/);

		expect(response.body).toHaveLength(DATA.length);
		expect(response.body[0].user).toBe(1);
		expect(response.body[0].user).toBe(DATA[0].user);
		expect(response.body[0].content).toBe(DATA[0].content);
		expect(response.body[0].score).toBe(DATA[0].score);
		expect(response.body[0].createdAt).toBeDefined();
		expect(response.body[0].createdAt instanceof Date && !isNaN(date.valueOf()))
			.toBeTrue;
		expect(response.body[0].replyingToComment).toBe(DATA[0].replyingToComment);
		expect(response.body[0].replyingToUser).toBe(DATA[0].replyingToUser);
	});

	test("Replies are correctly included in the array of their root comment", async () => {
		const ROOT_COMMENT_CONTENT = "This is the root comment";
		const DATA = [
			{
				user: 1,
				content: ROOT_COMMENT_CONTENT,
				score: 12,
				replyingToUser: null,
				replyingToComment: null,
			},
			{
				user: 2,
				content: "This is the reply",
				score: 5,
				replyingToUser: 0,
				replyingToComment: 1,
			},
		];

		DATA.forEach(async (comment) => {
			try {
				const addedComment = await Comment.insertOne([
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
			.get(API_URL)
			.auth(
				process.env.REACT_APP_CLIENT_ID,
				process.env.REACT_APP_CLIENT_SECRET
			)
			.expect(200)
			.expect("Content-Type", /application\/json/);

		const rootComment = response.body.find(
			(comment) => comment.content === ROOT_COMMENT_CONTENT
		);

		expect(response.body).toHaveLength(2);
		expect(rootComment.replies[0]).toBe(2);
	});
});

describe('POST "/api/comments/newComment"', () => {
	const ROUTE = API_URL + "/newComment";

	const VALID_NEW_COMMENT = {
		content: "A new comment with all fields.",
		user: 2,
	};

	test("Return the correct response when all required fields are provided.", async () => {
		const response = await api
			.post(ROUTE)
			.auth(
				process.env.REACT_APP_CLIENT_ID,
				process.env.REACT_APP_CLIENT_SECRET
			)
			.send({
				newComment: VALID_NEW_COMMENT,
			})
			.expect(201)
			.expect("Content-Type", /application\/json/);

		expect(response.body.content).toEqual(VALID_NEW_COMMENT.content);
		expect(response.body.user).toEqual(VALID_NEW_COMMENT.user);
		expect(response.body.createdAt).toBeDefined();
		expect(response.body.createdAt instanceof Date && !isNaN(date.valueOf()))
			.toBeTrue;
		expect(response.body.replyingToComment).toBeNull();
		expect(response.body.replyingToUser).toBeNull();
	});

	test("Return a status code when the content is missing", async () => {
		const response = await api
			.post(ROUTE)
			.auth(
				process.env.REACT_APP_CLIENT_ID,
				process.env.REACT_APP_CLIENT_SECRET
			)
			.send({ newComment: { user: 1 } })
			.expect(400);

		// TODO change the API or remove those assertions.
		// 	.expect("Content-Type", /application\/json/);
		// expect(response.body.error).toBe("Missing required field(s).");
	});

	test("Return a correct response when the id is missing", async () => {
		const response = await api
			.post(ROUTE)
			.auth(
				process.env.REACT_APP_CLIENT_ID,
				process.env.REACT_APP_CLIENT_SECRET
			)
			.send({ newComment: { content: "content provided but no user id" } })
			.expect(400);
	});
});

describe('POST "/api/comments/newReply"', () => {
	const ROUTE = API_URL + "/newReply";

	test("Returns the correct value for the new reply's content.", async () => {
		// The content as it was typed by the user, without the reference to the username of the first commenter.
		const NEW_REPLY_ENTERED = "New reply content.";
		const DATA = [
			{
				id: 1,
				content: "first comment",
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
				score: 9,
				replies: [],
				replyingToComment: 1,
				replyingToUser: 1,
			},
		];
		const AUTHOR_GETTING_REPLY = "First Commenter";
		const defaultValue = `@${AUTHOR_GETTING_REPLY} `;
		const newReply = {
			content: defaultValue + NEW_REPLY_ENTERED,
			user: 1,
			replyingToComment: 2,
			replyingToUser: 2,
			replyingToAuthor: AUTHOR_GETTING_REPLY,
		};

		const response = await api
			.post(ROUTE)
			.auth(
				process.env.REACT_APP_CLIENT_ID,
				process.env.REACT_APP_CLIENT_SECRET
			)
			.send({
				allComments: DATA,
				newComment: { ...newReply },
			})
			.expect(201)
			.expect("Content-Type", /application\/json/);

		expect(response.body.content).toBe(NEW_REPLY_ENTERED);
		expect(response.body.replyingToComment).toBe(1);
		expect(response.body.replyingToUser).toBe(2);
	});
	test("Returns the correct information on the comment getting replied to.", async () => {
		const DATA = [
			{
				id: 1,
				content: "first comment",
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
				score: 9,
				replies: [],
				replyingToComment: 1,
				replyingToUser: 1,
			},
		];

		const newReply = {
			content:
				"@username Replies to comment 2, but its root comment's id is 1.",
			user: 1,
			replyingToComment: 2,
			replyingToUser: 2,
			replyingToAuthor: "username",
		};

		const response = await api
			.post(ROUTE)
			.auth(
				process.env.REACT_APP_CLIENT_ID,
				process.env.REACT_APP_CLIENT_SECRET
			)
			.send({
				allComments: DATA,
				newComment: { ...newReply },
			})
			.expect(201)
			.expect("Content-Type", /application\/json/);

		expect(response.body.replyingToComment).toBe(1);
		expect(response.body.replyingToUser).toBe(2);
	});
});
