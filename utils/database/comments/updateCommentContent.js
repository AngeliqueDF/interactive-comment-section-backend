const path = require("path");
const { db } = require(path.resolve(__dirname, "./../connectTestDatabase"));

const Comment = require(path.resolve(__dirname, "./../../../models/comment"));

const statement = db.prepare(Comment.updateCommentContent());

const newContent = "Updated with updateCommentContent.js";

statement.run({ $newContent: newContent, $commentId: 1 });
