const db = require("../config/db");

async function createUser(username, passwordHash) {
  const sql = `
    INSERT INTO users (username, password_hash)
    VALUES ($1, $2)
    RETURNING id, username
  `;

  const result = await db.query(sql, [username, passwordHash]);
  return result.rows[0];
}

async function findUserByUsername(username) {
  const sql = `SELECT * FROM users WHERE username = $1`;
  const result = await db.query(sql, [username]);
  return result.rows[0] || null;
}

async function findUserById(id) {
  const sql = `SELECT id, username, created_at FROM users WHERE id = $1`;
  const result = await db.query(sql, [id]);
  return result.rows[0] || null;
}

module.exports = {
  createUser,
  findUserByUsername,
  findUserById,
};