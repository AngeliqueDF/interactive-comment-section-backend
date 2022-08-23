const express = require("express");
const app = express();

const helmet = require("helmet");

const commentsRouter = require("./controllers/comments");

app.use(helmet());
app.use(express.json());

module.exports = app;
