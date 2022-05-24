const sqlite3 = require("sqlite3").verbose();
const path = require("path");
const db = new sqlite3.Database(
  path.resolve(__dirname, "./../database.sqlite"),
  (err) => {
    if (err) {
      console.log(err);
    }
  }
);

const supertest = require("supertest");
const app = require("../app");
const api = supertest(app);

const Comment = require("./../models/comment");

const API_URL = "/api/comments";

const INITIAL_COMMENTS = [
  {
    id: 1,
    content:
      "Impressive! Though it seems the drag feature could be improved. But overall it looks incredible. You've nailed the design and the responsiveness at various breakpoints works really well.",
    createdAt: "1 month ago",
    score: 12,
    user: {
      image: {
        png: "./images/avatars/image-amyrobson.png",
        webp: "./images/avatars/image-amyrobson.webp",
      },
      username: "amyrobson",
    },
    // replies: [],
  },
  {
    id: 2,
    content:
      "Woah, your project looks awesome! How long have you been coding for? I'm still new, but think I want to dive into React as well soon. Perhaps you can give me an insight on where I can learn React? Thanks!",
    createdAt: "2 weeks ago",
    score: 5,
    user: {
      image: {
        png: "./images/avatars/image-maxblagun.png",
        webp: "./images/avatars/image-maxblagun.webp",
      },
      username: "maxblagun",
    },
  },
  {
    id: 3,
    content:
      "If you're still new, I'd recommend focusing on the fundamentals of HTML, CSS, and JS before considering React. It's very tempting to jump ahead but lay a solid foundation first.",
    createdAt: "1 week ago",
    score: 4,
    replyingTo: "maxblagun",
    user: {
      image: {
        png: "./images/avatars/image-ramsesmiron.png",
        webp: "./images/avatars/image-ramsesmiron.webp",
      },
      username: "ramsesmiron",
    },
  },
  {
    id: 4,
    content:
      "I couldn't agree more with this. Everything moves so fast and it always seems like everyone knows the newest library/framework. But the fundamentals are what stay constant.",
    createdAt: "2 days ago",
    score: 2,
    replyingTo: "ramsesmiron",
    user: {
      image: {
        png: "./images/avatars/image-juliusomo.png",
        webp: "./images/avatars/image-juliusomo.webp",
      },
      username: "juliusomo",
    },
  },
];


afterEach(() => {
  db.run(`DELETE FROM comments;`);
});

describe('GET "/api/comments"', () => {
  // ARRANGE
  beforeEach(async () => {
    // console.log("Adding comments to the database");
    const addCommentsQuery = `INSERT INTO comments (content, createdAt, score, user, replyingToComment) VALUES(?,?,?,?,?)`;
    const statement = db.prepare(addCommentsQuery);

    for (let i = 0; i < INITIAL_COMMENTS.length; i++) {
      statement.run([
        INITIAL_COMMENTS[i].content,
        new Date(),
        INITIAL_COMMENTS[i].score,
        INITIAL_COMMENTS[i].user.username,
        INITIAL_COMMENTS[i].replyingTo,
      ]);
    }

    await new Promise((res) => setTimeout(res, 1000));
  });
  // END ARRANGE
  test("Returns all comments in the database", async () => {
    const response = await api
      .get(API_URL)
      .expect(200)
      .expect("Content-Type", /application\/json/);

    expect(response.body).toHaveLength(INITIAL_COMMENTS.length);
  });
});

describe('POST "/api/comments"', () => {
  const spy = jest.spyOn(global, "Date");
  const NEW_COMMENT_ALL = {
    content:
      "Impressive! Though it seems the drag feature could be improved. But overall it looks incredible. You've nailed the design and the responsiveness at various breakpoints works really well.",
    user: 1,
    createdAt: spy.mock.instances[0],
    replyingToComment: 1,
  };
  test("Return the added comment", async () => {
    const response = await api
      .post(API_URL)
      .send(NEW_COMMENT_ALL)
      .expect(200)
      .expect("Content-Type", /application\/json/);

    expect(response.body.content).toEqual(NEW_COMMENT_ALL.content);
    expect(response.body.user).toEqual(NEW_COMMENT_ALL.user);
    expect(response.body.createdAt).toEqual(spy.mock.instances[0]); // check we called the correct function
    expect(response.body.replyingToComment).toEqual(
      NEW_COMMENT_ALL.replyingToComment
    );
  });


});
