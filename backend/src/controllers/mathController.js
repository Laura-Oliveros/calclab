const { solveLimit } = require("../services/limitService");

async function resolveLimit(req, res) {
  try {
    const { expression, tendsTo } = req.body;

    if (!expression || tendsTo === undefined || tendsTo === "") {
      return res.status(400).json({
        ok: false,
        message: "expression y tendsTo son obligatorios",
      });
    }

    const solution = solveLimit({
      expression,
      tendsTo,
    });

    return res.json({
      ok: true,
      solution,
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      message: "Error al resolver el límite",
      error: error.message,
    });
  }
}

module.exports = {
  resolveLimit,
};