const CREATE_USERS_TABLE_QUERY = `CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY,
    username TEXT NOT NULL UNIQUE,
    png TEXT,
    webp TEXT
  );`;

const DROP_USERS_TABLE_QUERY = "DROP TABLE IF EXISTS users;";

module.exports = { DROP_USERS_TABLE_QUERY, CREATE_USERS_TABLE_QUERY };
