const path = require("path");

// Modules interacting with the database
const CommentModel = require(path.resolve(__dirname, "./../models/comment"));

// Strips dangerous characters from data received from clients.
const xss = require("xss");

