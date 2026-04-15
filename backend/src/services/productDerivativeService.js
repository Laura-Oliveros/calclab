const nerdamer = require("nerdamer/all.min");

function normalizeExpression(expression) {
  return String(expression || "")
    .replace(/\s+/g, "")
    .replace(/×/g, "*")
    .replace(/÷/g, "/");
}

function formatCoefficient(value) {
  if (Number.isInteger(value)) return String(value);
  return String(Number(value.toFixed(10)));
}

function orderPolynomialTerms(expression) {
  const clean = String(expression || "").replace(/\s+/g, "");

  // Convierte restas en suma de negativos para separar términos
  const normalized = clean.replace(/-/g, "+-");
  const rawTerms = normalized.split("+").filter(Boolean);

  const grouped = new Map();

  for (const term of rawTerms) {
    let exponent = 0;
    let coefficient = 0;

    // ax^n
    let match = term.match(/^([+-]?\d+(?:\.\d+)?)\*x\^([+-]?\d+)$/);
    if (match) {
      coefficient = Number(match[1]);
      exponent = Number(match[2]);
    } else {
      // x^n
      match = term.match(/^([+-]?)x\^([+-]?\d+)$/);
      if (match) {
        coefficient = match[1] === "-" ? -1 : 1;
        exponent = Number(match[2]);
      } else {
        // ax
        match = term.match(/^([+-]?\d+(?:\.\d+)?)\*x$/);
        if (match) {
          coefficient = Number(match[1]);
          exponent = 1;
        } else {
          // x
          match = term.match(/^([+-]?)x$/);
          if (match) {
            coefficient = match[1] === "-" ? -1 : 1;
            exponent = 1;
          } else {
            // constante
            match = term.match(/^([+-]?\d+(?:\.\d+)?)$/);
            if (match) {
              coefficient = Number(match[1]);
              exponent = 0;
            } else {
              // Si aparece algo raro, devolvemos la expresión original
              return clean;
            }
          }
        }
      }
    }

    grouped.set(exponent, (grouped.get(exponent) || 0) + coefficient);
  }

  const orderedExponents = [...grouped.keys()].sort((a, b) => b - a);
  const finalTerms = [];

  for (const exp of orderedExponents) {
    const coef = grouped.get(exp);

    if (Math.abs(coef) < 1e-12) continue;

    let term = "";

    if (exp === 0) {
      term = formatCoefficient(coef);
    } else if (exp === 1) {
      if (coef === 1) term = "x";
      else if (coef === -1) term = "-x";
      else term = `${formatCoefficient(coef)}*x`;
    } else {
      if (coef === 1) term = `x^${exp}`;
      else if (coef === -1) term = `-x^${exp}`;
      else term = `${formatCoefficient(coef)}*x^${exp}`;
    }

    finalTerms.push(term);
  }

  if (finalTerms.length === 0) return "0";

  let result = finalTerms[0];
  for (let i = 1; i < finalTerms.length; i++) {
    if (finalTerms[i].startsWith("-")) {
      result += finalTerms[i];
    } else {
      result += `+${finalTerms[i]}`;
    }
  }

  return result;
}

function solveProductDerivative(expression) {
  if (!expression || typeof expression !== "string") {
    throw new Error("Expresión inválida.");
  }

  const normalized = normalizeExpression(expression);

  const derivativeRaw = nerdamer.diff(normalized, "x").toString();
  const expanded = nerdamer.expand(derivativeRaw).toString();
  const simplified = nerdamer(expanded).expand().toString();
  const ordered = orderPolynomialTerms(simplified);

  return {
    type: "product_rule",
    expression,
    steps: [
      {
        title: "Expresión original",
        content: `f(x) = ${expression}`,
      },
      {
        title: "Aplicamos derivación",
        content: derivativeRaw,
      },
      {
        title: "Expandimos",
        content: expanded,
      },
      {
        title: "Simplificamos",
        content: simplified,
      },
      {
        title: "Ordenamos términos",
        content: ordered,
      },
    ],
    result: ordered,
  };
}

module.exports = {
  solveProductDerivative,
};