const db = require("../config/db");

function createScore({ userId, gameType, score, correctAnswers, totalQuestions }) {
  return new Promise((resolve, reject) => {
    const sql = `
      INSERT INTO scores (user_id, game_type, score, correct_answers, total_questions)
      VALUES (?, ?, ?, ?, ?)
    `;

    db.run(
      sql,
      [userId, gameType, score, correctAnswers, totalQuestions],
      function (err) {
        if (err) return reject(err);
        resolve({ id: this.lastID });
      }
    );
  });
}

function getTopScores(limit = 10) {
  return new Promise((resolve, reject) => {
    const sql = `
      SELECT
        users.id,
        users.username,
        COALESCE(SUM(scores.score), 0) AS score
      FROM users
      LEFT JOIN scores ON scores.user_id = users.id
      GROUP BY users.id, users.username
      ORDER BY score DESC, users.username ASC
      LIMIT ?
    `;

    db.all(sql, [limit], (err, rows) => {
      if (err) return reject(err);
      resolve(rows);
    });
  });
}

module.exports = {
  createScore,
  getTopScores,
};