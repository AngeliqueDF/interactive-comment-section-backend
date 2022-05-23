const createUsersTable = () => {
  return `CREATE TABLE users (
    id INTEGER PRIMARY KEY,
    username TEXT NOT NULL UNIQUE,
    png_profile_image TEXT,
    webp_profile_image TEXT
  );`;
};

module.exports = { createUsersTable };
