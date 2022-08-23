const createUsersTable = () => `CREATE TABLE users (
    id INTEGER PRIMARY KEY,
    username TEXT NOT NULL UNIQUE,
    png TEXT,
    webp TEXT
  );`;

const dropUsersTable = () => "DROP TABLE IF EXISTS users;";

module.exports = { dropUsersTable, createUsersTable };
