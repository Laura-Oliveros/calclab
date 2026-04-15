const { solveSuccessiveDerivatives } = require("../services/successiveDerivativeService");

function resolveSuccessiveDerivatives(req, res) {
  try {
    const { expression, maxOrder } = req.body;

    if (!expression) {
      return res.status(400).json({
        ok: false,
        message: "La expresión es obligatoria",
      });
    }

    const solution = solveSuccessiveDerivatives(
      expression,
      maxOrder ? Number(maxOrder) : 15
    );

    return res.status(200).json({
      ok: true,
      solution,
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      message: "Error al resolver las derivadas sucesivas",
      error: error.message,
    });
  }
}

module.exports = {
  resolveSuccessiveDerivatives,
};