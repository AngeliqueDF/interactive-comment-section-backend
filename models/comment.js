// Create comments table
const createCommentsTable = () => `
  CREATE TABLE comments (
    id INTEGER PRIMARY KEY,
    content TEXT NOT NULL,
    createdAt TEXT NOT NULL,
    score INTEGER DEFAULT 0,
    user INTEGER NOT NULL,
    replyingToComment INTEGER DEFAULT NULL,
    FOREIGN KEY(user) REFERENCES users(id),
    FOREIGN KEY(replyingToComment) REFERENCES comments(id)
  );`;

module.exports = {
  createCommentsTable,
};
