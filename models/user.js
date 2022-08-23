const createUsersTable = () => `CREATE TABLE users (
    id INTEGER PRIMARY KEY,
    username TEXT NOT NULL UNIQUE,
    png TEXT,
    webp TEXT
  );`;

module.exports = { createUsersTable };
