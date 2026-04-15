const solveDerivative = require("../services/derivativeService");

function resolveDerivative(req, res) {
  try {
    const { expression, mode } = req.body;

    if (!expression) {
      return res.status(400).json({
        ok: false,
        message: "La expresión es obligatoria",
      });
    }

    const solution = solveDerivative(expression, mode || "auto");

    return res.status(200).json({
      ok: true,
      solution,
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      message: "Error al resolver la derivada",
      error: error.message,
    });
  }
}

module.exports = {
  resolveDerivative,
};