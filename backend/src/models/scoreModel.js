const db = require("../config/db");

async function createScore({
  userId,
  gameType,
  score,
  correctAnswers,
  totalQuestions,
}) {
  const sql = `
    INSERT INTO scores (user_id, game_type, score, correct_answers, total_questions)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING id
  `;

  const result = await db.query(sql, [
    userId,
    gameType,
    score,
    correctAnswers,
    totalQuestions,
  ]);

  return result.rows[0];
}

async function getTopScores(limit = 10) {
  const sql = `
    SELECT
      users.id,
      users.username,
      COALESCE(SUM(scores.score), 0) AS score
    FROM users
    LEFT JOIN scores ON scores.user_id = users.id
    GROUP BY users.id, users.username
    ORDER BY score DESC, users.username ASC
    LIMIT $1
  `;

  const result = await db.query(sql, [limit]);
  return result.rows;
}

module.exports = {
  createScore,
  getTopScores,
};