const { solveProductDerivative } = require("../services/productDerivativeService");

function resolveProductDerivative(req, res) {
  try {
    const { expression } = req.body;

    if (!expression) {
      return res.status(400).json({
        ok: false,
        message: "La expresión es obligatoria",
      });
    }

    const solution = solveProductDerivative(expression);

    return res.status(200).json({
      ok: true,
      solution,
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      message: "Error al resolver derivada por producto",
      error: error.message,
    });
  }
}

module.exports = {
  resolveProductDerivative,
};