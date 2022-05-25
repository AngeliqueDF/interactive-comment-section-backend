const express = require("express");
const app = express();
const helmet = require("helmet");
const { sanitizeInput } = require("./utils/middleware");

app.use(express.json());

app.use(helmet);
app.use(sanitizeInput);
module.exports = app;
