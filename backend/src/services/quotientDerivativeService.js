const nerdamer = require("nerdamer/all.min");

function normalizeExpression(expression) {
  return String(expression || "")
    .replace(/\s+/g, "")
    .replace(/×/g, "*")
    .replace(/÷/g, "/");
}

function splitTopLevelDivision(expression) {
  let depth = 0;
  let divisionIndex = -1;

  for (let i = 0; i < expression.length; i++) {
    const char = expression[i];

    if (char === "(") depth++;
    else if (char === ")") depth--;
    else if (char === "/" && depth === 0) {
      divisionIndex = i;
      break;
    }
  }

  if (divisionIndex === -1) return null;

  const numerator = expression.slice(0, divisionIndex).trim();
  const denominator = expression.slice(divisionIndex + 1).trim();

  if (!numerator || !denominator) return null;

  return { numerator, denominator };
}

function stripOuterParentheses(value) {
  let result = String(value || "").trim();

  function wrappedByOuterParens(str) {
    if (!str.startsWith("(") || !str.endsWith(")")) return false;

    let depth = 0;
    for (let i = 0; i < str.length; i++) {
      if (str[i] === "(") depth++;
      if (str[i] === ")") depth--;
      if (depth === 0 && i < str.length - 1) return false;
    }

    return depth === 0;
  }

  while (wrappedByOuterParens(result)) {
    result = result.slice(1, -1).trim();
  }

  return result;
}

function solveQuotientDerivative(expression) {
  if (!expression || typeof expression !== "string") {
    throw new Error("Expresión inválida.");
  }

  const normalized = normalizeExpression(expression);
  const parts = splitTopLevelDivision(normalized);

  if (!parts) {
    throw new Error("No se pudo identificar correctamente la división.");
  }

  const f = stripOuterParentheses(parts.numerator);
  const g = stripOuterParentheses(parts.denominator);

  const fPrime = nerdamer.diff(f, "x").toString();
  const gPrime = nerdamer.diff(g, "x").toString();

  const quotientFormula = `((${g})*(${fPrime})-(${f})*(${gPrime}))/((${g})^2)`;
  const expandedNumerator = nerdamer.expand(`(${g})*(${fPrime})-(${f})*(${gPrime})`).toString();
  const simplifiedNumerator = nerdamer(expandedNumerator).expand().toString();
  const finalPretty = `((${simplifiedNumerator})/((${g})^2))`;

  return {
    type: "quotient_rule",
    expression,
    steps: [
      {
        title: "Identificamos cociente",
        content: `f(x)=(${f}) y g(x)=(${g})`,
      },
      {
        title: "Propiedad de la división",
        content: "(f/g)' = (g·f' - f·g') / (g^2)",
      },
      {
        title: "Derivadas",
        content: `f'(x)=${fPrime}, g'(x)=${gPrime}`,
      },
      {
        title: "Sustituimos en la fórmula",
        content: quotientFormula,
      },
      {
        title: "Expandimos numerador",
        content: expandedNumerator,
      },
      {
        title: "Simplificamos",
        content: finalPretty,
      },
    ],
    result: finalPretty,
  };
}

module.exports = {
  solveQuotientDerivative,
};