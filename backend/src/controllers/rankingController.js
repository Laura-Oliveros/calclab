const { createScore, getTopScores } = require("../models/scoreModel");

async function saveScore(req, res) {
  try {
    const userId = req.user.id;
    const {
      gameType,
      score,
      correctAnswers = 0,
      totalQuestions = 0,
    } = req.body;

    if (!gameType || score === undefined || score === null) {
      return res.status(400).json({
        ok: false,
        message: "gameType y score son obligatorios",
      });
    }

    await createScore({
      userId,
      gameType,
      score,
      correctAnswers,
      totalQuestions,
    });

    res.status(201).json({
      ok: true,
      message: "Puntaje guardado correctamente",
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      message: "Error al guardar puntaje",
      error: error.message,
    });
  }
}

async function topScores(req, res) {
  try {
    const scores = await getTopScores(10);

    res.json({
      ok: true,
      scores,
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      message: "Error al obtener ranking",
      error: error.message,
    });
  }
}

module.exports = {
  saveScore,
  topScores,
};