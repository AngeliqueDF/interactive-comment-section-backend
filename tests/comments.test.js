const path = require("path");
const { db } = require(path.resolve(__dirname, "./../models/connectDatabase"))(
	"./../models/tdd-tests-database.sqlite"
);

const supertest = require("supertest");
const app = require("../app");
const api = supertest(app);

const Comment = require(path.resolve(__dirname, "./../models/comment"));

const API_URL = "/api/comments";

describe('GET "/api/comments"', () => {
  test("Returns all comments in the database", async () => {
    const response = await api
      .get(API_URL)
      .expect(200)
      .expect("Content-Type", /application\/json/);

    expect(response.body).toHaveLength(INITIAL_COMMENTS.length);
  });
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

});

describe('POST "/api/comments"', () => {
	afterEach(() => {
		// Empty the database after each test
		db.run(`DELETE FROM comments;`);
	});

	const spy = jest.spyOn(global, "Date");
	const VALID_NEW_COMMENT_ALL_FIELDS = {
		content:
			"Added by the 'Return the added comment' test. Provides all fields in the body",
		user: 1,
		createdAt: spy.mock.instances[0],
		replyingToComment: 1,
		replyingToUser: 1,
	};
	const VALID_NEW_COMMENT_REQUIRED_FIELDS = {
		content:
			"Added by the 'Return the added comment' test. Provides only required fields in the body.",
		user: 1,
		createdAt: spy.mock.instances[0],
	};

	test("Return the correct response when a comment with all fields is added.", async () => {
		const response = await api
			.post(API_URL)
			.send(VALID_NEW_COMMENT_ALL_FIELDS)
			.expect(201)
			.expect("Content-Type", /application\/json/);

		expect(response.body.content).toEqual(VALID_NEW_COMMENT_ALL_FIELDS.content);
		expect(response.body.user).toEqual(VALID_NEW_COMMENT_ALL_FIELDS.user);
		expect(response.body.createdAt).toEqual(spy.mock.instances[0]); // check new Date() was called
		expect(response.body.replyingToComment).toEqual(
			VALID_NEW_COMMENT_ALL_FIELDS.replyingToComment
		);
		expect(response.body.replyingToUser).toEqual(
			VALID_NEW_COMMENT_ALL_FIELDS.replyingToUser
		);
	});

	test("When optional values are not provided, they return the correct default value", async () => {
		const response = await api
			.post(API_URL)
			.send(VALID_NEW_COMMENT_REQUIRED_FIELDS)
			.expect(201)
			.expect("Content-Type", /application\/json/);

		expect(response.body.replyingToComment).toBeNull();
		expect(response.body.replyingToUser).toBeNull();
	});

	test("Return an error when the content is missing", async () => {
		const response = await api
			.post(API_URL)
			.send({ ...VALID_NEW_COMMENT_ALL_FIELDS, content: null })
			.expect(400)
			.expect("Content-Type", /application\/json/);
	});
});
