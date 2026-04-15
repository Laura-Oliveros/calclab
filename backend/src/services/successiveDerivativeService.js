const solveDerivative = require("./derivativeService");

function toOrdinalLabel(order) {
  if (order === 1) return "f'(x)";
  if (order === 2) return "f''(x)";
  if (order === 3) return "f'''(x)";
  return `f^(${order})(x)`;
}

function normalizeForComparison(value) {
  return String(value || "").replace(/\s+/g, "");
}

function solveSuccessiveDerivatives(expression, maxOrder = 15) {
  if (!expression || typeof expression !== "string") {
    throw new Error("Expresión inválida.");
  }

  if (!Number.isInteger(maxOrder) || maxOrder < 1) {
    throw new Error("El orden máximo debe ser un número entero mayor que 0.");
  }

  let currentExpression = expression;
  const derivatives = [];

  for (let order = 1; order <= maxOrder; order++) {
    const solution = solveDerivative(currentExpression);
    const result = solution.result;

    derivatives.push({
      order,
      label: toOrdinalLabel(order),
      input: currentExpression,
      result,
      steps: solution.steps || [],
      ruleType: solution.type || "unknown",
    });

    if (normalizeForComparison(result) === "0") {
      break;
    }

    currentExpression = result;
  }

  return {
    type: "successive_derivatives",
    expression,
    maxOrder,
    derivatives,
    finalResult: derivatives.length
      ? derivatives[derivatives.length - 1].result
      : null,
  };
}

module.exports = {
  solveSuccessiveDerivatives,
};