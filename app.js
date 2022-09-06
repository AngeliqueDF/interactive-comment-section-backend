const express = require("express");
const app = express();

const helmet = require("helmet");

const commentsRouter = require("./controllers/comments.routes");

app.use(helmet());
app.use(express.json());

app.use("/api/comments", commentsRouter);

module.exports = app;
