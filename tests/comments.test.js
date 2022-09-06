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
	// ARRANGE
	const INITIAL_COMMENTS = [
		{
			user: 0,
			content:
				"Impressive! Though it seems the drag feature could be improved. But overall it looks incredible. You've nailed the design and the responsiveness at various breakpoints works really well.",
			createdAt: new Date(),
			score: 12,
		},
		{
			user: 1,
			content:
				"Woah, your project looks awesome! How long have you been coding for? I'm still new, but think I want to dive into React as well soon. Perhaps you can give me an insight on where I can learn React? Thanks!",
			createdAt: new Date(),
			score: 5,
		},
		{
			user: 2,
			content:
				"If you're still new, I'd recommend focusing on the fundamentals of HTML, CSS, and JS before considering React. It's very tempting to jump ahead but lay a solid foundation first.",
			createdAt: new Date(),
			score: 4,
			replyingTo: "maxblagun",
		},
		{
			user: 3,
			content:
				"I couldn't agree more with this. Everything moves so fast and it always seems like everyone knows the newest library/framework. But the fundamentals are what stay constant.",
			createdAt: new Date(),
			score: 2,
			replyingTo: "ramsesmiron",
		},
	];

	beforeEach(() => {
		// add
		INITIAL_COMMENTS.forEach(async (comment) => {
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

	afterEach(() => {
		db.run(`DELETE FROM comments;`);
	});
	// End arrange

	test("Returns all comments in the database", async () => {
		const response = await api
			.get(API_URL)
			.expect(200)
			.expect("Content-Type", /application\/json/);

		expect(response.body).toHaveLength(INITIAL_COMMENTS.length);
	});
});

describe.only('POST "/api/comments"', () => {
	afterEach(() => {
		// Empty the database after each test
		db.run(`DELETE FROM comments;`);
	});

	const VALID_NEW_COMMENT_ALL_FIELDS = {
		content: "A new comment with all fields.",
		user: 2,
		replyingToComment: 1,
		replyingToUser: 1,
	};
	const VALID_NEW_COMMENT_REQUIRED_FIELDS = {
		content: "A new comment without optional fields.",
		user: 1,
	};

	test("Return the correct response when a comment with all fields is added.", async () => {
		const sampleState = [{ id: 1, content: "Comment in the state.", user: 1 }];

		const response = await api
			.post(API_URL)
			.send({
				allComments: sampleState,
				newComment: VALID_NEW_COMMENT_ALL_FIELDS,
			})
			.expect(201)
			.expect("Content-Type", /application\/json/);

		expect(response.body.content).toEqual(VALID_NEW_COMMENT_ALL_FIELDS.content);
		expect(response.body.user).toEqual(VALID_NEW_COMMENT_ALL_FIELDS.user);
		expect(response.body.createdAt).toBeDefined();
		expect(spy).toHaveBeenCalled(); // Check new Date() was called. createdAt will evaluate to '[object Object]' in the database, and mockConstructor {} in the response body. Which is normal because the Date constructor is being mocked.
		expect(response.body.replyingToComment).toEqual(
			VALID_NEW_COMMENT_ALL_FIELDS.replyingToComment
		);
		expect(response.body.replyingToUser).toEqual(
			VALID_NEW_COMMENT_ALL_FIELDS.replyingToUser
		);
	});

	test.only("Returns the correct value for replyingToComment.", async () => {
		const DATA = [
			{
				id: 1,
				content: "first comment",
				user: 1,
			},
			{
				id: 2,
				content: "second comment",
				user: 2,
				replyingToComment: 1,
				replyingToUser: 1,
			},
		];

		const response = await api
			.post(API_URL)
			.send({
				allComments: DATA,
				newComment: {
					content: "Replies to comment 2, but its root comment's id is 1.",
					user: 1,
					replyingToComment: 2,
					replyingToUser: 2,
				},
			})
			.expect(201)
			.expect("Content-Type", /application\/json/);

		expect(response.body.replyingToComment).toBe(1);
		expect(response.body.replyingToUser).toBe(2);
	});

	test("When optional values are not provided, they return the correct default value", async () => {
		const response = await api
			.post(API_URL)
			.send({ newComment: VALID_NEW_COMMENT_REQUIRED_FIELDS })
			.expect(201)
			.expect("Content-Type", /application\/json/);

		expect(response.body.replyingToComment).toBeNull();
		expect(response.body.replyingToUser).toBeNull();
	});

	test("Return an error response when the content is missing", async () => {
		const response = await api
			.post(API_URL)
			.send({ newComment: { ...VALID_NEW_COMMENT_ALL_FIELDS, content: null } })
			.expect(400)
			.expect("Content-Type", /application\/json/);
		expect(response.body.error).toBe("Missing required field(s).");
	});
});
