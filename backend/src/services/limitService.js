const { evaluate } = require("mathjs");
const nerdamer = require("nerdamer/all.min");

function normalizeExpression(expression) {
  return String(expression || "")
    .replace(/\s+/g, "")
    .replace(/×/g, "*")
    .replace(/÷/g, "/")
    .replace(/π/gi, "pi");
}

function parseTendsTo(tendsTo) {
  const value = String(tendsTo).trim().toLowerCase();

  if (
    value === "∞" ||
    value === "+∞" ||
    value === "inf" ||
    value === "+inf" ||
    value === "infinity" ||
    value === "+infinity"
  ) {
    return Infinity;
  }

  if (value === "-∞" || value === "-inf" || value === "-infinity") {
    return -Infinity;
  }

  const numeric = Number(value);
  if (!Number.isNaN(numeric)) return numeric;

  throw new Error("El valor al que tiende x no es válido.");
}

function formatNumber(value) {
  if (value === Infinity) return "∞";
  if (value === -Infinity) return "-∞";
  if (typeof value === "string") return value;
  if (!Number.isFinite(value)) return String(value);
  if (Math.abs(value) < 1e-12) return "0";
  if (Number.isInteger(value)) return String(value);
  return String(Number(value.toFixed(8)));
}

function safeEvaluate(expression, xValue) {
  try {
    const result = evaluate(expression, {
      x: xValue,
      pi: Math.PI,
      e: Math.E,
    });

    if (typeof result !== "number" || Number.isNaN(result)) {
      return { ok: false, value: null };
    }

    return { ok: true, value: result };
  } catch {
    return { ok: false, value: null };
  }
}

function addStep(steps, title, lines) {
  const content = Array.isArray(lines)
    ? lines.filter(Boolean).join(" | ")
    : String(lines || "");
  steps.push({ title, content });
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

function splitTopLevelDivision(expression) {
  let depth = 0;

  for (let i = 0; i < expression.length; i++) {
    const ch = expression[i];

    if (ch === "(") depth++;
    else if (ch === ")") depth--;
    else if (ch === "/" && depth === 0) {
      const numerator = expression.slice(0, i).trim();
      const denominator = expression.slice(i + 1).trim();

      if (!numerator || !denominator) return null;

      return {
        numerator: stripOuterParentheses(numerator),
        denominator: stripOuterParentheses(denominator),
      };
    }
  }

  return null;
}

function detectIndeterminateForm(expr, target) {
  const division = splitTopLevelDivision(expr);
  if (!division) return null;

  const numEval = safeEvaluate(division.numerator, target);
  const denEval = safeEvaluate(division.denominator, target);

  if (!numEval.ok || !denEval.ok) return null;

  if (Number(numEval.value) === 0 && Number(denEval.value) === 0) return "0/0";
  if (!Number.isFinite(numEval.value) && !Number.isFinite(denEval.value)) return "∞/∞";

  return null;
}

function substituteExpression(expression, value) {
  const replacement =
    value === Infinity || value === -Infinity
      ? formatNumber(value)
      : `(${formatNumber(value)})`;

  return expression.replace(/x/g, replacement);
}

function trySimplify(expression) {
  try {
    if (typeof nerdamer.simplify === "function") {
      return nerdamer.simplify(expression).toString();
    }
    return nerdamer(expression).toString();
  } catch {
    try {
      return nerdamer(expression).expand().toString();
    } catch {
      return expression;
    }
  }
}

function tryExpand(expression) {
  try {
    return nerdamer(expression).expand().toString();
  } catch {
    return expression;
  }
}

function approxEqual(a, b, tolerance = 1e-6) {
  if (!Number.isFinite(a) || !Number.isFinite(b)) return a === b;
  return Math.abs(a - b) <= tolerance * Math.max(1, Math.abs(a), Math.abs(b));
}

function probeFinitePoint(expression, point) {
  const deltas = [1e-2, 1e-3, 1e-4];
  const leftValues = [];
  const rightValues = [];

  for (const d of deltas) {
    const left = safeEvaluate(expression, point - d);
    const right = safeEvaluate(expression, point + d);

    if (left.ok) leftValues.push(left.value);
    if (right.ok) rightValues.push(right.value);
  }

  return { leftValues, rightValues };
}

function inferFromSideValues(leftValues, rightValues) {
  if (!leftValues.length || !rightValues.length) {
    return { exists: false, result: null };
  }

  const left = leftValues[leftValues.length - 1];
  const right = rightValues[rightValues.length - 1];

  if (Number.isFinite(left) && Number.isFinite(right) && approxEqual(left, right)) {
    return { exists: true, result: (left + right) / 2 };
  }

  if (!Number.isFinite(left) && !Number.isFinite(right) && left === right) {
    return { exists: true, result: left };
  }

  return { exists: false, result: null };
}

function parsePolynomial(expression) {
  const expanded = tryExpand(expression).replace(/\s+/g, "");

  if (
    expanded.includes("sqrt(") ||
    expanded.includes("/") ||
    expanded.includes("sin(") ||
    expanded.includes("cos(") ||
    expanded.includes("tan(") ||
    expanded.includes("log(") ||
    expanded.includes("ln(")
  ) {
    return null;
  }

  let normalized = expanded;
  if (!normalized.startsWith("-")) normalized = "+" + normalized;

  const terms = normalized.match(/[+-][^+-]+/g);
  if (!terms) return null;

  const poly = {};

  for (const term of terms) {
    const sign = term.startsWith("-") ? -1 : 1;
    const body = term.slice(1);

    if (!body.includes("x")) {
      const c = Number(body);
      if (Number.isNaN(c)) return null;
      poly[0] = (poly[0] || 0) + sign * c;
      continue;
    }

    let coefficient = 1;
    let exponent = 1;

    const parts = body.split("x");
    const left = parts[0];
    const right = parts[1];

    if (left && left !== "*") {
      const leftClean = left.endsWith("*") ? left.slice(0, -1) : left;
      if (leftClean !== "") {
        const c = Number(leftClean);
        if (Number.isNaN(c)) return null;
        coefficient = c;
      }
    }

    if (right && right.startsWith("^")) {
      exponent = Number(right.slice(1));
      if (Number.isNaN(exponent)) return null;
    }

    poly[exponent] = (poly[exponent] || 0) + sign * coefficient;
  }

  return poly;
}

function getDegree(poly) {
  const exponents = Object.keys(poly)
    .map(Number)
    .filter((e) => poly[e] !== 0);

  if (!exponents.length) return null;
  return Math.max(...exponents);
}

function getLeadingCoefficient(poly) {
  const degree = getDegree(poly);
  if (degree === null) return null;
  return poly[degree];
}

function termToString(coeff, exp) {
  const absCoeff = Math.abs(coeff);

  if (exp === 0) return `${absCoeff}`;
  if (exp === 1) return absCoeff === 1 ? "x" : `${absCoeff}*x`;
  return absCoeff === 1 ? `x^${exp}` : `${absCoeff}*x^${exp}`;
}

function buildDivideByPowerRaw(poly, power) {
  const exponents = Object.keys(poly)
    .map(Number)
    .sort((a, b) => b - a);

  const pieces = [];

  for (const exp of exponents) {
    const coeff = poly[exp];
    if (coeff === 0) continue;

    const sign = coeff >= 0 ? "+" : "-";
    const top = termToString(coeff, exp);
    const piece = exp === 0
      ? `${Math.abs(coeff)}/x^${power}`
      : `${top}/x^${power}`;

    pieces.push(`${sign}${piece}`);
  }

  return pieces.join("").replace(/^\+/, "").replace(/\+\-/g, "-");
}

function buildDividedSimplified(poly, power) {
  const exponents = Object.keys(poly)
    .map(Number)
    .sort((a, b) => b - a);

  const pieces = [];

  for (const exp of exponents) {
    const coeff = poly[exp];
    if (coeff === 0) continue;

    const sign = coeff >= 0 ? "+" : "-";
    const absCoeff = Math.abs(coeff);
    const newExp = exp - power;

    let piece = "";

    if (newExp === 0) {
      piece = `${absCoeff}`;
    } else if (newExp > 0) {
      piece = absCoeff === 1
        ? (newExp === 1 ? "x" : `x^${newExp}`)
        : (newExp === 1 ? `${absCoeff}*x` : `${absCoeff}*x^${newExp}`);
    } else {
      const denExp = Math.abs(newExp);
      piece = absCoeff === 1
        ? (denExp === 1 ? "1/x" : `1/x^${denExp}`)
        : (denExp === 1 ? `${absCoeff}/x` : `${absCoeff}/x^${denExp}`);
    }

    pieces.push(`${sign}${piece}`);
  }

  return pieces.join("").replace(/^\+/, "").replace(/\+\-/g, "-") || "0";
}

function extractZeroTerms(expression) {
  const matches = String(expression).match(/(\d+\/x\^\d+|\d+\/x|1\/x\^\d+|1\/x)/g);
  return matches || [];
}

function zeroTendencyText(parts) {
  if (!Array.isArray(parts)) return "Los términos con x en el denominador tienden a 0.";

  const pieces = parts.filter(Boolean).map((item) => `${item} → 0`);
  return pieces.length
    ? pieces.join(" | ")
    : "Los términos con x en el denominador tienden a 0.";
}

function factorPolynomialDetailed(expression) {
  const poly = parsePolynomial(expression);
  if (!poly) return null;

  const degree = getDegree(poly);
  if (degree === null) return null;

  const a = poly[2] || 0;
  const b = poly[1] || 0;
  const c = poly[0] || 0;

  if (degree >= 1 && c === 0) {
    const reduced = {};
    Object.keys(poly).forEach((key) => {
      const exp = Number(key);
      if (exp > 0) reduced[exp - 1] = poly[exp];
    });

    const reducedText = polynomialToString(reduced);
    return {
      factored: `x*(${reducedText})`,
      factors: ["x", `(${reducedText})`],
    };
  }

  if (degree !== 2 || a === 0) return null;

  if (a === 1 && b === 0 && c < 0) {
    const root = Math.sqrt(Math.abs(c));
    if (Number.isInteger(root)) {
      return {
        factored: `(x-${root})*(x+${root})`,
        factors: [`(x-${root})`, `(x+${root})`],
      };
    }
  }

  if (a === 1) {
    const rootC = Math.sqrt(Math.abs(c));
    if (Number.isInteger(rootC) && Math.abs(b) === 2 * rootC && c > 0) {
      const sign = b < 0 ? "-" : "+";
      return {
        factored: `(x${sign}${rootC})^2`,
        factors: [`(x${sign}${rootC})`, `(x${sign}${rootC})`],
      };
    }
  }

  const discriminant = b * b - 4 * a * c;
  if (discriminant >= 0) {
    const sqrtD = Math.sqrt(discriminant);
    if (Number.isInteger(sqrtD)) {
      const root1 = (-b + sqrtD) / (2 * a);
      const root2 = (-b - sqrtD) / (2 * a);

      const factor1 = root1 >= 0 ? `(x-${formatNumber(root1)})` : `(x+${formatNumber(Math.abs(root1))})`;
      const factor2 = root2 >= 0 ? `(x-${formatNumber(root2)})` : `(x+${formatNumber(Math.abs(root2))})`;

      const lead = a === 1 ? "" : `${a}*`;

      return {
        factored: `${lead}${factor1}*${factor2}`,
        factors: a === 1 ? [factor1, factor2] : [String(a), factor1, factor2],
      };
    }
  }

  return null;
}

function polynomialToString(poly) {
  const exponents = Object.keys(poly)
    .map(Number)
    .sort((a, b) => b - a);

  let result = "";

  for (const exp of exponents) {
    const coeff = poly[exp];
    if (coeff === 0) continue;

    const sign = coeff >= 0 ? "+" : "-";
    const absCoeff = Math.abs(coeff);

    let term = "";
    if (exp === 0) {
      term = `${absCoeff}`;
    } else if (exp === 1) {
      term = absCoeff === 1 ? "x" : `${absCoeff}*x`;
    } else {
      term = absCoeff === 1 ? `x^${exp}` : `${absCoeff}*x^${exp}`;
    }

    result += `${sign}${term}`;
  }

  return result.replace(/^\+/, "") || "0";
}

function normalizeFactorString(factor) {
  return String(factor || "").replace(/\s+/g, "");
}

function cancelCommonFactor(numFactors, denFactors) {
  const usedDen = new Array(denFactors.length).fill(false);
  const remainingNum = [];
  const remainingDen = [];
  const cancelled = [];

  for (const nf of numFactors) {
    const nfNorm = normalizeFactorString(nf);
    let found = false;

    for (let i = 0; i < denFactors.length; i++) {
      if (usedDen[i]) continue;
      if (normalizeFactorString(denFactors[i]) === nfNorm) {
        usedDen[i] = true;
        cancelled.push(nf);
        found = true;
        break;
      }
    }

    if (!found) remainingNum.push(nf);
  }

  for (let i = 0; i < denFactors.length; i++) {
    if (!usedDen[i]) remainingDen.push(denFactors[i]);
  }

  return { cancelled, remainingNum, remainingDen };
}

function factorsToExpression(factors) {
  if (!factors.length) return "1";
  return factors.join("*");
}

function solveDirectSubstitution(expr, target, steps) {
  const substituted = substituteExpression(expr, target);
  const direct = safeEvaluate(expr, target);

  addStep(steps, "Sustitución directa", [
    `lim x→${formatNumber(target)} ${expr}`,
    `= ${substituted}`,
  ]);

  if (direct.ok && Number.isFinite(direct.value)) {
    addStep(steps, "Operamos", [`= ${formatNumber(direct.value)}`]);
    addStep(steps, "Resultado final", [`El límite es ${formatNumber(direct.value)}.`]);

    return {
      type: "direct_substitution",
      result: formatNumber(direct.value),
    };
  }

  return null;
}

function solveByDetailedFactorization(expr, target, steps) {
  const division = splitTopLevelDivision(expr);
  if (!division) return null;

  const numeratorFactored = factorPolynomialDetailed(division.numerator);
  const denominatorFactored = factorPolynomialDetailed(division.denominator);

  if (!numeratorFactored && !denominatorFactored) return null;

  const numFactors = numeratorFactored ? numeratorFactored.factors : [division.numerator];
  const denFactors = denominatorFactored ? denominatorFactored.factors : [division.denominator];

  if (numeratorFactored) {
    addStep(steps, "Factorizamos el numerador", [
      `${division.numerator}`,
      `= ${numeratorFactored.factored}`,
    ]);
  }

  if (denominatorFactored) {
    addStep(steps, "Factorizamos el denominador", [
      `${division.denominator}`,
      `= ${denominatorFactored.factored}`,
    ]);
  }

  const cancelled = cancelCommonFactor(numFactors, denFactors);

  if (!cancelled.cancelled.length) {
    const simplified = trySimplify(expr);
    if (simplified === expr) return null;

    addStep(steps, "Simplificación algebraica", [
      `${expr}`,
      `= ${simplified}`,
    ]);

    const substituted = substituteExpression(simplified, target);
    const evaluated = safeEvaluate(simplified, target);

    if (evaluated.ok && Number.isFinite(evaluated.value)) {
      addStep(steps, "Sustitución en la simplificada", [`= ${substituted}`]);
      addStep(steps, "Operamos", [`= ${formatNumber(evaluated.value)}`]);
      addStep(steps, "Resultado final", [`El límite es ${formatNumber(evaluated.value)}.`]);

      return {
        type: "simplified_substitution",
        result: formatNumber(evaluated.value),
        simplifiedExpression: simplified,
      };
    }

    return null;
  }

  const beforeCancel = `((${factorsToExpression(numFactors)})/(${factorsToExpression(denFactors)}))`;
  const afterCancel = `((${factorsToExpression(cancelled.remainingNum)})/(${factorsToExpression(cancelled.remainingDen)}))`;
  const simplified = trySimplify(afterCancel);

  addStep(steps, "Cancelamos el factor común", [
    `${beforeCancel}`,
    `= ${afterCancel}`,
    simplified !== afterCancel ? `= ${simplified}` : null,
  ]);

  const substituted = substituteExpression(simplified, target);
  const evaluated = safeEvaluate(simplified, target);

  if (evaluated.ok && Number.isFinite(evaluated.value)) {
    addStep(steps, "Sustitución en la simplificada", [`= ${substituted}`]);
    addStep(steps, "Operamos", [`= ${formatNumber(evaluated.value)}`]);
    addStep(steps, "Resultado final", [`El límite es ${formatNumber(evaluated.value)}.`]);

    return {
      type: "factorization",
      result: formatNumber(evaluated.value),
      simplifiedExpression: simplified,
    };
  }

  return null;
}

function cleanMath(text) {
  return String(text || "")
    .replace(/\s+/g, "")
    .replace(/\+\-/g, "-")
    .replace(/\-\-/g, "+")
    .replace(/\(\(/g, "(")
    .replace(/\)\)/g, ")");
}

function tryRootCuadernoSteps(expr, target) {
  const division = splitTopLevelDivision(expr);
  if (!division) return null;

  const num = division.numerator;
  const den = division.denominator;

  const match1 = num.match(/^sqrt\((.+)\)-(.+)$/); // sqrt(A)-b
  const match2 = num.match(/^sqrt\((.+)\)-sqrt\((.+)\)$/); // sqrt(A)-sqrt(B)
  const match3 = num.match(/^(.+)-sqrt\((.+)\)$/); // a-sqrt(B)

  let conjugate = null;
  let numExpanded = null;
  let denExpanded = null;
  let simplified = null;

  if (match1) {
    const A = match1[1];
    const b = stripOuterParentheses(match1[2]);
    conjugate = `sqrt(${A})+${b}`;
    numExpanded = `${A}-(${b})^2`;
    denExpanded = `(${den})*(sqrt(${A})+${b})`;
  } else if (match2) {
    const A = match2[1];
    const B = match2[2];
    conjugate = `sqrt(${A})+sqrt(${B})`;
    numExpanded = `${A}-(${B})`;
    denExpanded = `(${den})*(sqrt(${A})+sqrt(${B}))`;
  } else if (match3) {
    const a = stripOuterParentheses(match3[1]);
    const B = match3[2];
    conjugate = `${a}+sqrt(${B})`;
    numExpanded = `(${a})^2-${B}`;
    denExpanded = `(${den})*(${a}+sqrt(${B}))`;
  } else {
    return null;
  }

  const multipliedFraction = `((${num})/(${den}))* ((${conjugate})/(${conjugate}))`;
  const expandedFraction = `((${numExpanded})/(${denExpanded}))`;
  simplified = trySimplify(expandedFraction);
  const substituted = substituteExpression(simplified, target);
  const evaluated = safeEvaluate(simplified, target);

  if (!evaluated.ok || !Number.isFinite(evaluated.value)) return null;

  return {
    multipliedFraction: cleanMath(multipliedFraction),
    expandedFraction: cleanMath(expandedFraction),
    simplified: cleanMath(simplified),
    substituted: cleanMath(substituted),
    result: evaluated.value,
  };
}

function solveByInfinityRules(expr, target, steps) {
  const division = splitTopLevelDivision(expr);
  if (!division) return null;

  const numPoly = parsePolynomial(division.numerator);
  const denPoly = parsePolynomial(division.denominator);

  if (!numPoly || !denPoly) return null;

  const degNum = getDegree(numPoly);
  const degDen = getDegree(denPoly);
  const maxDegree = Math.max(degNum, degDen);

  addStep(steps, "Dividimos por la mayor potencia de x", [
    `Dividimos numerador y denominador por x^${maxDegree}.`,
  ]);

  const rawNum = buildDivideByPowerRaw(numPoly, maxDegree);
  const rawDen = buildDivideByPowerRaw(denPoly, maxDegree);
  const numDivided = buildDividedSimplified(numPoly, maxDegree);
  const denDivided = buildDividedSimplified(denPoly, maxDegree);

  addStep(steps, "Desarrollamos la división", [
    `${expr}`,
    `= (${rawNum}) / (${rawDen})`,
    `= (${numDivided}) / (${denDivided})`,
  ]);

  const zeroPieces = [
    ...extractZeroTerms(numDivided),
    ...extractZeroTerms(denDivided),
  ];

  addStep(steps, "Cuando x tiende a infinito", [
    zeroTendencyText(zeroPieces),
  ]);

  const leadNum = getLeadingCoefficient(numPoly);
  const leadDen = getLeadingCoefficient(denPoly);

  if (degNum < degDen) {
    addStep(steps, "Sustituimos los términos que van a 0", [
      `= 0`,
    ]);
    addStep(steps, "Resultado final", ["El límite es 0."]);

    return {
      type: "infinity_by_degrees",
      result: "0",
    };
  }

  if (degNum === degDen) {
    const result = leadNum / leadDen;

    addStep(steps, "Sustituimos los términos que van a 0", [
      `= ${leadNum}/${leadDen}`,
      `= ${formatNumber(result)}`,
    ]);

    addStep(steps, "Resultado final", [
      `El límite es ${formatNumber(result)}.`,
    ]);

    return {
      type: "infinity_by_degrees",
      result: formatNumber(result),
    };
  }

  const sign = leadNum / leadDen > 0 ? 1 : -1;
  const result =
    target === Infinity
      ? sign > 0
        ? Infinity
        : -Infinity
      : sign > 0
      ? degNum % 2 === 0 && degDen % 2 === 0
        ? Infinity
        : -Infinity
      : degNum % 2 === 0 && degDen % 2 === 0
      ? -Infinity
      : Infinity;

  addStep(steps, "Comparación de grados", [
    "El grado del numerador es mayor que el del denominador.",
    `Por eso la fracción crece sin límite y el resultado es ${formatNumber(result)}.`,
  ]);

  addStep(steps, "Resultado final", [
    `El límite es ${formatNumber(result)}.`,
  ]);

  return {
    type: "infinity_by_degrees",
    result: formatNumber(result),
  };
}

function solveLimit({ expression, tendsTo }) {
  if (!expression) {
    throw new Error("La expresión es obligatoria.");
  }

  const expr = normalizeExpression(expression);
  const target = parseTendsTo(tendsTo);

  const steps = [];
  addStep(steps, "Expresión original", [
    `lim x→${formatNumber(target)} ${expr}`,
  ]);

  if (Number.isFinite(target)) {
    const indeterminate = detectIndeterminateForm(expr, target);

    if (!indeterminate) {
      const direct = solveDirectSubstitution(expr, target, steps);
      if (direct) {
        return {
          type: direct.type,
          expression: expr,
          tendsTo: formatNumber(target),
          steps,
          result: direct.result,
        };
      }
    } else {
      addStep(steps, "Sustitución directa", [
        `Al sustituir x=${formatNumber(target)} obtenemos ${indeterminate}.`,
      ]);
    }

    if (expr.includes("sqrt(")) {
      const rootDetailed = tryRootCuadernoSteps(expr, target);

      if (rootDetailed) {
        addStep(steps, "Multiplicamos por el conjugado", [
          `${expr}`,
          `= ${rootDetailed.multipliedFraction}`,
        ]);

        addStep(steps, "Aplicamos diferencia de cuadrados", [
          `= ${rootDetailed.expandedFraction}`,
        ]);

        addStep(steps, "Simplificamos", [
          `= ${rootDetailed.simplified}`,
        ]);

        addStep(steps, "Sustituimos en la simplificada", [
          `= ${rootDetailed.substituted}`,
        ]);

        addStep(steps, "Operamos", [
          `= ${formatNumber(rootDetailed.result)}`,
        ]);

        addStep(steps, "Resultado final", [
          `El límite es ${formatNumber(rootDetailed.result)}.`,
        ]);

        return {
          type: "rationalization",
          expression: expr,
          tendsTo: formatNumber(target),
          simplifiedExpression: rootDetailed.simplified,
          steps,
          result: formatNumber(rootDetailed.result),
        };
      }
    }

    const factorized = solveByDetailedFactorization(expr, target, steps);
    if (factorized) {
      return {
        type: factorized.type,
        expression: expr,
        tendsTo: formatNumber(target),
        simplifiedExpression: factorized.simplifiedExpression,
        steps,
        result: factorized.result,
      };
    }

    const { leftValues, rightValues } = probeFinitePoint(expr, target);
    const inferred = inferFromSideValues(leftValues, rightValues);

    if (inferred.exists) {
      addStep(steps, "Análisis del comportamiento", [
        "La expresión se aproxima a un mismo valor.",
        `= ${formatNumber(inferred.result)}`,
      ]);

      addStep(steps, "Resultado final", [
        `El límite es ${formatNumber(inferred.result)}.`,
      ]);

      return {
        type: "behavior_analysis",
        expression: expr,
        tendsTo: formatNumber(target),
        steps,
        result: formatNumber(inferred.result),
      };
    }

    addStep(steps, "Resultado final", [
      "El límite no existe.",
    ]);

    return {
      type: "does_not_exist",
      expression: expr,
      tendsTo: formatNumber(target),
      steps,
      result: "No existe",
    };
  }

  const infinitySolved = solveByInfinityRules(expr, target, steps);
  if (infinitySolved) {
    return {
      type: infinitySolved.type,
      expression: expr,
      tendsTo: formatNumber(target),
      steps,
      result: infinitySolved.result,
    };
  }

  throw new Error("Ese tipo de límite aún no está configurado en Calclab.");
}

module.exports = {
  solveLimit,
};