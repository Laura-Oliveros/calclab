import { useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/client";

function gcd(a, b) {
  a = Math.abs(a);
  b = Math.abs(b);

  while (b) {
    const temp = b;
    b = a % b;
    a = temp;
  }

  return a || 1;
}

function decimalToNiceFraction(value) {
  const num = Number(value);
  if (!Number.isFinite(num)) return null;

  const tolerance = 1e-6;
  const maxDenominator = 20;

  for (let den = 1; den <= maxDenominator; den++) {
    const numerator = Math.round(num * den);
    const approx = numerator / den;

    if (Math.abs(approx - num) < tolerance) {
      const divisor = gcd(numerator, den);
      const n = numerator / divisor;
      const d = den / divisor;

      if (d === 1) return String(n);
      return `${n}/${d}`;
    }
  }

  return null;
}

const expressionKeys = [
  { label: "x", value: "x", type: "variable" },
  { label: "^", value: "^", type: "operator" },
  { label: "(", value: "(", type: "group" },
  { label: ")", value: ")", type: "group" },
  { label: "√x", value: "sqrt(", type: "special" },

  { label: "7", value: "7", type: "number" },
  { label: "8", value: "8", type: "number" },
  { label: "9", value: "9", type: "number" },
  { label: "+", value: "+", type: "operator" },
  { label: "-", value: "-", type: "operator" },

  { label: "4", value: "4", type: "number" },
  { label: "5", value: "5", type: "number" },
  { label: "6", value: "6", type: "number" },
  { label: "×", value: "*", type: "operator" },
  { label: "÷", value: "/", type: "operator" },

  { label: "1", value: "1", type: "number" },
  { label: "2", value: "2", type: "number" },
  { label: "3", value: "3", type: "number" },
  { label: "x²", value: "x^2", type: "special" },
  { label: "x³", value: "x^3", type: "special" },

  { label: "0", value: "0", type: "number" },
  { label: ".", value: ".", type: "number" },
  { label: "π", value: "pi", type: "special" },
  { label: "−x", value: "-x", type: "special" },
  { label: "1/x", value: "1/x", type: "special" },
];

const tendsToKeys = [
  { label: "∞", value: "infinity", type: "special" },
  { label: "-∞", value: "-infinity", type: "special" },
  { label: "π", value: "pi", type: "special" },
  { label: "-", value: "-", type: "operator" },

  { label: "7", value: "7", type: "number" },
  { label: "8", value: "8", type: "number" },
  { label: "9", value: "9", type: "number" },
  { label: ".", value: ".", type: "number" },

  { label: "4", value: "4", type: "number" },
  { label: "5", value: "5", type: "number" },
  { label: "6", value: "6", type: "number" },
  { label: "0", value: "0", type: "number" },

  { label: "1", value: "1", type: "number" },
  { label: "2", value: "2", type: "number" },
  { label: "3", value: "3", type: "number" },
];

const limitConfigs = {
  direct: {
    title: "🔢 Sustitución directa",
    subtitle: "Para límites donde basta con reemplazar x por el valor indicado.",
    emptyText: "Resuelve un límite para ver aquí el procedimiento completo.",
    examples: [
      { expression: "x^3+4*x-1", tendsTo: "2" },
      { expression: "2*x^2+3*x+1", tendsTo: "-1" },
      { expression: "5*x-7", tendsTo: "4" },
      { expression: "x^2+9", tendsTo: "-3" },
    ],
  },
  indeterminate: {
    title: "♾️ Indeterminaciones",
    subtitle: "Para casos tipo 0/0 donde toca simplificar o racionalizar.",
    emptyText: "Resuelve una indeterminación para ver aquí el procedimiento completo.",
    examples: [
      { expression: "(x^2-4)/(x-2)", tendsTo: "2" },
      { expression: "(x^2-9)/(x-3)", tendsTo: "3" },
      { expression: "(x^2+3*x+2)/(x+1)", tendsTo: "-1" },
      { expression: "(x^2-2*x+1)/(x-1)", tendsTo: "1" },
    ],
  },
  roots: {
    title: "√ Límites con raíces",
    subtitle: "Para ejercicios con raíces donde puede aparecer racionalización o simplificación.",
    emptyText: "Resuelve un límite con raíces para ver aquí el procedimiento completo.",
    examples: [
      { expression: "(sqrt(x)-3)/(x-9)", tendsTo: "9" },
      { expression: "(sqrt(x)-2)/(x-4)", tendsTo: "4" },
      { expression: "(1-sqrt(1-x^2))/(x^2)", tendsTo: "0" },
      { expression: "(sqrt(x+7)-4)/(x-9)", tendsTo: "9" },
    ],
  },
  infinity: {
    title: "🚀 Límites al infinito",
    subtitle: "Para expresiones cuando x tiende a infinito o menos infinito.",
    emptyText: "Resuelve un límite al infinito para ver aquí el procedimiento completo.",
    examples: [
      { expression: "(6*x^2+2*x+3)/(x+1)", tendsTo: "infinity" },
      { expression: "(4*x^3+8*x-3)/(x^2+x+1)", tendsTo: "infinity" },
      { expression: "(7*x-9)/(x^3-8)", tendsTo: "infinity" },
      { expression: "(6*x^3+8*x-3)/(3*x^3+1)", tendsTo: "infinity" },
    ],
  },
};

export default function Limits({ limitType = "direct" }) {
  const config = limitConfigs[limitType] || limitConfigs.direct;

  const [expression, setExpression] = useState("");
  const [tendsTo, setTendsTo] = useState("");
  const [solution, setSolution] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [keyboardOpen, setKeyboardOpen] = useState(false);
  const [editingField, setEditingField] = useState("expression");

  async function handleSolve() {
    setError("");
    setSolution(null);
    setLoading(true);

    try {
      const response = await api.post("/math/limit", {
        expression,
        tendsTo,
      });

      setSolution(response.data.solution);
    } catch (err) {
      setSolution(null);
      setError(
        err?.response?.data?.error ||
          err?.response?.data?.message ||
          "No se pudo resolver el límite."
      );
    } finally {
      setLoading(false);
    }
  }

  function handleInsertValue(value) {
    if (editingField === "expression") {
      setExpression((prev) => prev + value);
    } else {
      setTendsTo((prev) => prev + value);
    }
  }

  function handleBackspace() {
    if (editingField === "expression") {
      setExpression((prev) => prev.slice(0, -1));
    } else {
      setTendsTo((prev) => prev.slice(0, -1));
    }
  }

  function handleClearField() {
    if (editingField === "expression") {
      setExpression("");
    } else {
      setTendsTo("");
    }
  }

  function handleClearAll() {
    setExpression("");
    setTendsTo("");
    setSolution(null);
    setError("");
  }

  function selectExample(example) {
    setExpression(example.expression);
    setTendsTo(example.tendsTo);
    setSolution(null);
    setError("");
  }

  const fractionResult = solution?.result
    ? decimalToNiceFraction(solution.result)
    : null;

  const currentKeys = editingField === "expression" ? expressionKeys : tendsToKeys;

  return (
    <div style={pageStyle}>
      <Link to="/limits" style={backButtonStyle}>
        ← Volver
      </Link>

      <div style={heroStyle}>
        <p style={eyebrowStyle}>MÓDULO DE LÍMITES</p>
        <h1 style={titleStyle}>{config.title}</h1>
        <p style={subtitleStyle}>{config.subtitle}</p>
      </div>

      <div style={mainGridStyle}>
        <div style={leftCardStyle}>
          <div style={cardHeaderStyle}>
            <div>
              <h2 style={sectionTitleStyle}>Constructor</h2>
              <p style={sectionSubStyle}>
                Escribe la expresión y el valor al que tiende x. Usa el teclado para no confundirte.
              </p>
            </div>
            <div style={badgeStyle}>Calclab</div>
          </div>

          <button
            type="button"
            onClick={() => {
              setEditingField("expression");
              setKeyboardOpen(true);
            }}
            style={{
              ...fieldButtonStyle,
              border:
                editingField === "expression"
                  ? "1px solid rgba(96,165,250,0.45)"
                  : fieldButtonStyle.border,
            }}
          >
            <div style={fieldLabelStyle}>Expresión</div>
            <div style={fieldValueStyle}>
              {expression || (
                <span style={placeholderStyle}>Toca para escribir la expresión</span>
              )}
            </div>
          </button>

          <button
            type="button"
            onClick={() => {
              setEditingField("tendsTo");
              setKeyboardOpen(true);
            }}
            style={{
              ...fieldButtonStyle,
              marginTop: "12px",
              border:
                editingField === "tendsTo"
                  ? "1px solid rgba(96,165,250,0.45)"
                  : fieldButtonStyle.border,
            }}
          >
            <div style={fieldLabelStyle}>X tiende a</div>
            <div style={fieldValueStyle}>
              {tendsTo || (
                <span style={placeholderStyle}>Toca para escribir el valor</span>
              )}
            </div>
          </button>

          <div style={miniActionsStyle}>
            <button
              type="button"
              onClick={() => {
                setEditingField("expression");
                setKeyboardOpen(true);
              }}
              style={softButtonStyle}
            >
              Editar expresión
            </button>

            <button
              type="button"
              onClick={() => {
                setEditingField("tendsTo");
                setKeyboardOpen(true);
              }}
              style={softButtonStyle}
            >
              Editar valor
            </button>
          </div>

          <div style={miniActionsStyle}>
            <button type="button" onClick={handleClearAll} style={dangerButtonStyle}>
              Limpiar todo
            </button>

            <button type="button" onClick={handleSolve} style={solveButtonStyle}>
              {loading ? "Resolviendo..." : "Resolver límite"}
            </button>
          </div>

          <div style={examplesBoxStyle}>
            <div style={examplesTitleStyle}>Ejemplos</div>
            <div style={examplesHelpStyle}>
              Toca uno para cargarlo automáticamente en la calculadora.
            </div>

            <div style={examplesListStyle}>
              {config.examples.map((example, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => selectExample(example)}
                  style={exampleButtonStyle}
                >
                  <div style={exampleMainStyle}>{example.expression}</div>
                  <div style={exampleSubStyle}>con x → {example.tendsTo}</div>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div style={rightCardStyle}>
          <div style={cardHeaderStyle}>
            <div>
              <h2 style={sectionTitleStyle}>Solución</h2>
              <p style={sectionSubStyle}>
                Aquí aparece el desarrollo. La idea es que puedas seguir cada paso y entender qué se hizo.
              </p>
            </div>
          </div>

          {error && <div style={errorStyle}>{error}</div>}

          {!error && !solution && (
            <div style={emptyStateStyle}>{config.emptyText}</div>
          )}

          {solution && (
            <>
              <div style={exerciseBoxStyle}>
                <div style={exerciseLabelStyle}>Ejercicio</div>
                <div style={exerciseValueStyle}>
                  lim x→{tendsTo} {expression}
                </div>
              </div>

              <div style={stepsWrapStyle}>
                {solution.steps?.map((step, index) => (
                  <div key={index} style={stepCardStyle}>
                    <div style={stepTopStyle}>
                      <div style={stepIndexStyle}>{index + 1}</div>
                      <div style={stepTitleStyle}>{step.title}</div>
                    </div>

                    <div style={stepMathBoxStyle}>
                      {String(step.content || "")
                        .split(" | ")
                        .map((line, lineIndex) => (
                          <div key={lineIndex} style={stepMathLineStyle}>
                            {line}
                          </div>
                        ))}
                    </div>
                  </div>
                ))}
              </div>

              <div style={resultBoxStyle}>
                <div>
                  <div style={resultLabelStyle}>Resultado final</div>
                  <div style={resultMainStyle}>{solution.result}</div>
                </div>

                {fractionResult &&
                  fractionResult !== String(solution.result) && (
                    <div style={fractionBadgeStyle}>≈ {fractionResult}</div>
                  )}
              </div>
            </>
          )}
        </div>
      </div>

      {keyboardOpen && (
        <div style={overlayStyle} onClick={() => setKeyboardOpen(false)}>
          <div style={keyboardModalStyle} onClick={(e) => e.stopPropagation()}>
            <div style={keyboardTopStyle}>
              <div>
                <div style={keyboardTitleStyle}>Teclado matemático</div>
                <div style={keyboardSubStyle}>
                  {editingField === "expression"
                    ? "Escribe la expresión del límite."
                    : "Escribe el valor al que tiende x."}
                </div>
              </div>

              <button
                type="button"
                onClick={() => setKeyboardOpen(false)}
                style={closeButtonStyle}
              >
                ✕
              </button>
            </div>

            <div style={keyboardTabsStyle}>
              <button
                type="button"
                onClick={() => setEditingField("expression")}
                style={{
                  ...keyboardTabStyle,
                  ...(editingField === "expression" ? activeKeyboardTabStyle : {}),
                }}
              >
                Expresión
              </button>

              <button
                type="button"
                onClick={() => setEditingField("tendsTo")}
                style={{
                  ...keyboardTabStyle,
                  ...(editingField === "tendsTo" ? activeKeyboardTabStyle : {}),
                }}
              >
                X tiende a
              </button>
            </div>

            <div style={keyboardPreviewLabelStyle}>
              {editingField === "expression" ? "Expresión" : "X tiende a"}
            </div>

            <div style={keyboardPreviewStyle}>
              {editingField === "expression"
                ? expression || "La expresión aparecerá aquí"
                : tendsTo || "El valor aparecerá aquí"}
            </div>

            <div style={helperRowStyle}>
              <div style={helperPillStyle}>x = variable</div>
              <div style={helperPillStyle}>^ = potencia</div>
              <div style={helperPillStyle}>√x = raíz</div>
              <div style={helperPillStyle}>∞ = infinito</div>
            </div>

            <div
              style={{
                ...keyboardGridStyle,
                gridTemplateColumns: "repeat(5, 1fr)",
              }}
            >
              {currentKeys.map((key) => (
                <button
                  key={`${key.label}-${key.value}`}
                  type="button"
                  onClick={() => handleInsertValue(key.value)}
                  style={getKeyboardButtonStyle(key.type)}
                >
                  {key.label}
                </button>
              ))}
            </div>

            <div style={keyboardActionsStyle}>
              <button type="button" onClick={handleBackspace} style={softButtonStyle}>
                ⌫ Borrar
              </button>

              <button type="button" onClick={handleClearField} style={dangerButtonStyle}>
                Limpiar campo
              </button>

              <button
                type="button"
                onClick={() => setKeyboardOpen(false)}
                style={solveButtonStyle}
              >
                Listo
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function getKeyboardButtonStyle(type) {
  const base = { ...keyboardButtonStyle };

  if (type === "operator") {
    return { ...base, background: "rgba(37,99,235,0.18)" };
  }

  if (type === "variable" || type === "group" || type === "special") {
    return { ...base, background: "rgba(124,58,237,0.20)" };
  }

  return base;
}

const pageStyle = {
  padding: "24px 24px 36px",
  maxWidth: "1380px",
  margin: "0 auto",
};

const backButtonStyle = {
  display: "inline-block",
  marginBottom: "18px",
  padding: "10px 16px",
  borderRadius: "12px",
  textDecoration: "none",
  color: "white",
  background: "rgba(255,255,255,0.06)",
  border: "1px solid rgba(255,255,255,0.10)",
  fontWeight: "700",
  fontSize: "14px",
};

const heroStyle = {
  marginBottom: "18px",
  textAlign: "center",
};

const eyebrowStyle = {
  color: "#60a5fa",
  fontWeight: "800",
  fontSize: "13px",
  letterSpacing: "1px",
  marginBottom: "6px",
};

const titleStyle = {
  margin: "0 0 8px 0",
  fontSize: "38px",
  lineHeight: "1.05",
};

const subtitleStyle = {
  margin: 0,
  color: "#cbd5e1",
  fontSize: "15px",
  lineHeight: "1.6",
};

const mainGridStyle = {
  display: "grid",
  gridTemplateColumns: "500px 1fr",
  gap: "20px",
  alignItems: "start",
};

const leftCardStyle = {
  background: "linear-gradient(180deg, rgba(255,255,255,0.06), rgba(255,255,255,0.03))",
  border: "1px solid rgba(255,255,255,0.08)",
  borderRadius: "24px",
  padding: "18px",
  boxShadow: "0 16px 34px rgba(0,0,0,0.22)",
};

const rightCardStyle = {
  background: "linear-gradient(180deg, rgba(255,255,255,0.06), rgba(255,255,255,0.03))",
  border: "1px solid rgba(255,255,255,0.08)",
  borderRadius: "24px",
  padding: "18px",
  boxShadow: "0 16px 34px rgba(0,0,0,0.22)",
  minHeight: "420px",
};

const cardHeaderStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-start",
  gap: "12px",
  marginBottom: "12px",
};

const badgeStyle = {
  padding: "6px 10px",
  borderRadius: "999px",
  background: "rgba(96,165,250,0.12)",
  border: "1px solid rgba(96,165,250,0.22)",
  color: "#bfdbfe",
  fontWeight: "700",
  fontSize: "12px",
};

const sectionTitleStyle = {
  margin: 0,
  fontSize: "24px",
};

const sectionSubStyle = {
  margin: "4px 0 0 0",
  color: "#94a3b8",
  fontSize: "13px",
  lineHeight: "1.5",
};

const fieldButtonStyle = {
  width: "100%",
  textAlign: "left",
  padding: "14px",
  borderRadius: "16px",
  border: "1px solid rgba(255,255,255,0.10)",
  background: "rgba(15,23,42,0.55)",
  cursor: "pointer",
};

const fieldLabelStyle = {
  fontSize: "12px",
  color: "#93c5fd",
  fontWeight: "800",
  marginBottom: "6px",
  textTransform: "uppercase",
  letterSpacing: "0.5px",
};

const fieldValueStyle = {
  color: "white",
  fontSize: "17px",
  minHeight: "24px",
  wordBreak: "break-word",
  lineHeight: "1.5",
};

const placeholderStyle = {
  color: "#64748b",
};

const miniActionsStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(2, 1fr)",
  gap: "10px",
  marginTop: "12px",
};

const softButtonStyle = {
  padding: "12px 14px",
  borderRadius: "12px",
  border: "1px solid rgba(255,255,255,0.10)",
  background: "rgba(255,255,255,0.05)",
  color: "white",
  fontWeight: "700",
  fontSize: "13px",
  cursor: "pointer",
};

const dangerButtonStyle = {
  padding: "12px 14px",
  borderRadius: "12px",
  border: "none",
  background: "rgba(239,68,68,0.22)",
  color: "white",
  fontWeight: "800",
  fontSize: "13px",
  cursor: "pointer",
};

const solveButtonStyle = {
  padding: "12px 14px",
  borderRadius: "12px",
  border: "none",
  background: "linear-gradient(135deg, #2563eb, #7c3aed)",
  color: "white",
  fontWeight: "800",
  fontSize: "13px",
  cursor: "pointer",
  boxShadow: "0 10px 24px rgba(37,99,235,0.20)",
};

const examplesBoxStyle = {
  marginTop: "16px",
  padding: "14px",
  borderRadius: "16px",
  background: "rgba(15,23,42,0.45)",
  border: "1px solid rgba(255,255,255,0.06)",
};

const examplesTitleStyle = {
  fontSize: "13px",
  fontWeight: "800",
  color: "#93c5fd",
  marginBottom: "4px",
  textTransform: "uppercase",
  letterSpacing: "0.5px",
};

const examplesHelpStyle = {
  color: "#94a3b8",
  fontSize: "12px",
  marginBottom: "10px",
  lineHeight: "1.5",
};

const examplesListStyle = {
  display: "flex",
  flexDirection: "column",
  gap: "10px",
};

const exampleButtonStyle = {
  width: "100%",
  textAlign: "left",
  padding: "12px 14px",
  borderRadius: "12px",
  border: "1px solid rgba(255,255,255,0.08)",
  background: "rgba(255,255,255,0.04)",
  color: "#e2e8f0",
  cursor: "pointer",
};

const exampleMainStyle = {
  fontSize: "14px",
  fontWeight: "700",
  marginBottom: "3px",
  wordBreak: "break-word",
};

const exampleSubStyle = {
  fontSize: "12px",
  color: "#94a3b8",
};

const errorStyle = {
  background: "rgba(239,68,68,0.15)",
  border: "1px solid rgba(239,68,68,0.3)",
  color: "#fecaca",
  padding: "14px",
  borderRadius: "12px",
};

const emptyStateStyle = {
  padding: "18px",
  borderRadius: "16px",
  color: "#94a3b8",
  background: "rgba(15,23,42,0.4)",
  border: "1px dashed rgba(255,255,255,0.08)",
  fontSize: "14px",
};

const exerciseBoxStyle = {
  padding: "16px",
  borderRadius: "16px",
  background: "rgba(37,99,235,0.12)",
  border: "1px solid rgba(96,165,250,0.25)",
  marginBottom: "14px",
};

const exerciseLabelStyle = {
  color: "#bfdbfe",
  fontWeight: "700",
  marginBottom: "6px",
  fontSize: "13px",
};

const exerciseValueStyle = {
  fontSize: "18px",
  fontWeight: "700",
  lineHeight: "1.6",
  wordBreak: "break-word",
};

const stepsWrapStyle = {
  display: "flex",
  flexDirection: "column",
  gap: "10px",
};

const stepCardStyle = {
  background: "rgba(15,23,42,0.55)",
  border: "1px solid rgba(255,255,255,0.06)",
  borderRadius: "16px",
  padding: "14px",
};

const stepTopStyle = {
  display: "flex",
  alignItems: "center",
  gap: "10px",
  marginBottom: "10px",
};

const stepIndexStyle = {
  width: "30px",
  height: "30px",
  minWidth: "30px",
  borderRadius: "999px",
  background: "rgba(96,165,250,0.18)",
  color: "#dbeafe",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontWeight: "800",
  fontSize: "13px",
};

const stepTitleStyle = {
  fontWeight: "800",
  color: "#93c5fd",
  fontSize: "14px",
};

const stepMathBoxStyle = {
  borderRadius: "12px",
  background: "rgba(255,255,255,0.03)",
  padding: "12px",
  border: "1px solid rgba(255,255,255,0.05)",
};

const stepMathLineStyle = {
  fontSize: "15px",
  color: "#f8fafc",
  lineHeight: "1.7",
  wordBreak: "break-word",
  fontFamily:
    'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
};

const resultBoxStyle = {
  marginTop: "16px",
  padding: "16px",
  borderRadius: "16px",
  background: "linear-gradient(135deg, #2563eb, #7c3aed)",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: "12px",
  flexWrap: "wrap",
};

const resultLabelStyle = {
  fontSize: "13px",
  fontWeight: "700",
  opacity: 0.95,
  marginBottom: "4px",
};

const resultMainStyle = {
  fontSize: "28px",
  fontWeight: "800",
};

const fractionBadgeStyle = {
  padding: "8px 12px",
  borderRadius: "999px",
  background: "rgba(255,255,255,0.16)",
  fontWeight: "800",
  fontSize: "14px",
};

const overlayStyle = {
  position: "fixed",
  inset: 0,
  background: "rgba(2,6,23,0.72)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "20px",
  zIndex: 999,
};

const keyboardModalStyle = {
  width: "min(760px, 100%)",
  background: "linear-gradient(180deg, rgba(15,23,42,0.98), rgba(15,23,42,0.94))",
  border: "1px solid rgba(255,255,255,0.10)",
  borderRadius: "24px",
  padding: "18px",
  boxShadow: "0 25px 60px rgba(0,0,0,0.35)",
};

const keyboardTopStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-start",
  gap: "12px",
  marginBottom: "12px",
};

const keyboardTitleStyle = {
  fontSize: "28px",
  fontWeight: "800",
};

const keyboardSubStyle = {
  marginTop: "4px",
  color: "#cbd5e1",
  fontSize: "14px",
};

const closeButtonStyle = {
  width: "40px",
  height: "40px",
  borderRadius: "12px",
  border: "1px solid rgba(255,255,255,0.10)",
  background: "rgba(255,255,255,0.05)",
  color: "white",
  fontWeight: "800",
  cursor: "pointer",
};

const keyboardTabsStyle = {
  display: "flex",
  gap: "10px",
  marginBottom: "12px",
};

const keyboardTabStyle = {
  padding: "10px 14px",
  borderRadius: "12px",
  border: "1px solid rgba(255,255,255,0.08)",
  background: "rgba(255,255,255,0.04)",
  color: "white",
  fontWeight: "700",
  cursor: "pointer",
};

const activeKeyboardTabStyle = {
  background: "linear-gradient(135deg, #2563eb, #7c3aed)",
  border: "none",
};

const keyboardPreviewLabelStyle = {
  fontSize: "12px",
  color: "#93c5fd",
  fontWeight: "800",
  textTransform: "uppercase",
  marginBottom: "6px",
};

const keyboardPreviewStyle = {
  minHeight: "54px",
  borderRadius: "16px",
  padding: "14px 16px",
  background: "rgba(255,255,255,0.04)",
  border: "1px solid rgba(255,255,255,0.08)",
  color: "white",
  fontSize: "18px",
  display: "flex",
  alignItems: "center",
  wordBreak: "break-word",
  marginBottom: "12px",
  lineHeight: "1.5",
};

const helperRowStyle = {
  display: "flex",
  gap: "8px",
  flexWrap: "wrap",
  marginBottom: "14px",
};

const helperPillStyle = {
  padding: "6px 10px",
  borderRadius: "999px",
  background: "rgba(255,255,255,0.05)",
  border: "1px solid rgba(255,255,255,0.08)",
  color: "#cbd5e1",
  fontSize: "12px",
  fontWeight: "700",
};

const keyboardGridStyle = {
  display: "grid",
  gap: "10px",
};

const keyboardButtonStyle = {
  padding: "10px 10px",
  borderRadius: "14px",
  border: "1px solid rgba(255,255,255,0.08)",
  background: "rgba(255,255,255,0.06)",
  color: "white",
  fontWeight: "800",
  fontSize: "14px",
  cursor: "pointer",
};

const keyboardActionsStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(3, 1fr)",
  gap: "10px",
  marginTop: "14px",
};