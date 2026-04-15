const db = require("../config/db");

function createUser(username, passwordHash) {
  return new Promise((resolve, reject) => {
    const sql = `INSERT INTO users (username, password_hash) VALUES (?, ?)`;
    db.run(sql, [username, passwordHash], function (err) {
      if (err) return reject(err);
      resolve({
        id: this.lastID,
        username,
      });
    });
  });
}

function findUserByUsername(username) {
  return new Promise((resolve, reject) => {
    const sql = `SELECT * FROM users WHERE username = ?`;
    db.get(sql, [username], (err, row) => {
      if (err) return reject(err);
      resolve(row || null);
    });
  });
}

function findUserById(id) {
  return new Promise((resolve, reject) => {
    const sql = `SELECT id, username, created_at FROM users WHERE id = ?`;
    db.get(sql, [id], (err, row) => {
      if (err) return reject(err);
      resolve(row || null);
    });
  });
}

module.exports = {
  createUser,
  findUserByUsername,
  findUserById,
};