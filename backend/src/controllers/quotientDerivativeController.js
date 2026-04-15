const { solveQuotientDerivative } = require("../services/quotientDerivativeService");

function resolveQuotientDerivative(req, res) {
  try {
    const { expression } = req.body;

    if (!expression) {
      return res.status(400).json({
        ok: false,
        message: "La expresión es obligatoria",
      });
    }

    const solution = solveQuotientDerivative(expression);

    return res.status(200).json({
      ok: true,
      solution,
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      message: "Error al resolver derivada por división",
      error: error.message,
    });
  }
}

module.exports = {
  resolveQuotientDerivative,
};