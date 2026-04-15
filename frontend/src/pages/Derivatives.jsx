import { useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/client";

const expressionKeys = [
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
  { label: "^", value: "^", type: "operator" },
  { label: "x", value: "x", type: "variable" },

  { label: "0", value: "0", type: "number" },
  { label: "(", value: "(", type: "group" },
  { label: ")", value: ")", type: "group" },
  { label: "x²", value: "x^2", type: "power" },
  { label: "x³", value: "x^3", type: "power" },
];

const derivativeConfigs = {
  constant: {
    title: "🔢 Derivada de constante",
    subtitle: "Resuelve constantes de forma clara y directa.",
    endpoint: "/math/derivative",
    examples: ["8", "-3", "15", "2/3"],
    tip: (
      <>
        Para constantes escribe, por ejemplo:
        <br />
        <strong>8</strong>, <strong>-3</strong>, <strong>15</strong>
      </>
    ),
    emptyText: "Resuelve una constante para ver aquí el procedimiento completo.",
    buttonText: "Resolver derivada",
  },
  sum: {
    title: "➕ Propiedad de la suma",
    subtitle: "Resuelve derivadas aplicando la propiedad de la suma.",
    endpoint: "/math/derivative",
    examples: ["x^2+3*x", "4*x^3+2*x^2", "x^4+7*x+9"],
    tip: (
      <>
        Para suma escribe, por ejemplo:
        <br />
        <strong>x^2+3*x</strong>, <strong>4*x^3+2*x^2</strong>
      </>
    ),
    emptyText: "Resuelve una suma para ver aquí el procedimiento completo.",
    buttonText: "Resolver derivada",
  },
  subtraction: {
    title: "➖ Propiedad de la resta",
    subtitle: "Resuelve derivadas aplicando la propiedad de la resta.",
    endpoint: "/math/derivative",
    examples: ["x^2-3*x", "4*x^3-2*x^2", "x^4-7*x-9"],
    tip: (
      <>
        Para resta escribe, por ejemplo:
        <br />
        <strong>x^2-3*x</strong>, <strong>4*x^3-2*x^2</strong>
      </>
    ),
    emptyText: "Resuelve una resta para ver aquí el procedimiento completo.",
    buttonText: "Resolver derivada",
  },
  power: {
    title: "📈 Coeficiente por potencia",
    subtitle: "Aplica la regla de coeficiente por potencia paso a paso.",
    endpoint: "/math/derivative",
    examples: ["4*x^2", "3*x^6", "-3*x^-2", "4*x^3-2*x^2-3*x-1"],
    tip: (
      <>
        Para coeficiente por potencia escribe, por ejemplo:
        <br />
        <strong>4*x^2</strong>, <strong>3*x^6</strong>, <strong>-3*x^-2</strong>
      </>
    ),
    emptyText: "Resuelve una derivada básica para ver aquí el procedimiento completo.",
    buttonText: "Resolver derivada",
  },
  product: {
    title: "✖️ Propiedad del producto",
    subtitle: "Aplica la regla del producto con factores entre paréntesis.",
    endpoint: "/math/derivative-product",
    examples: ["(x^2)*(x+9)", "(4*x^2+6*x+1)*(3*x^2+1)"],
    tip: (
      <>
        Para producto escribe cada factor entre paréntesis:
        <br />
        <strong>(x^2)*(x+9)</strong>
        <br />
        <strong>(4*x^2+6*x+1)*(3*x^2+1)</strong>
      </>
    ),
    emptyText: "Resuelve un producto para ver aquí el procedimiento completo.",
    buttonText: "Resolver derivada",
  },
  quotient: {
    title: "➗ Propiedad de la división",
    subtitle: "Aplica la regla de la división con numerador y denominador entre paréntesis.",
    endpoint: "/math/derivative-quotient",
    examples: ["(4*x+1)/(2*x^6-1)", "(3*x^2+2*x+3)/(x-1)"],
    tip: (
      <>
        Para división escribe numerador y denominador entre paréntesis:
        <br />
        <strong>(4*x+1)/(2*x^6-1)</strong>
        <br />
        <strong>(3*x^2+2*x+3)/(x-1)</strong>
      </>
    ),
    emptyText: "Resuelve una división para ver aquí el procedimiento completo.",
    buttonText: "Resolver derivada",
  },
  successive: {
    title: "🔁 Derivadas sucesivas",
    subtitle: "Calcula derivadas sucesivas de una misma función.",
    endpoint: "/math/derivative-successive",
    examples: ["4*x^6-3*x+4", "3*x^6+2*x+9", "-3*x^-2+7*x-3"],
    tip: (
      <>
        Para derivadas sucesivas prueba, por ejemplo:
        <br />
        <strong>4*x^6-3*x+4</strong>, <strong>3*x^6+2*x+9</strong>,{" "}
        <strong>-3*x^-2+7*x-3</strong>
      </>
    ),
    emptyText: "Resuelve una función para ver aquí sus derivadas sucesivas.",
    buttonText: "Resolver sucesivas",
  },
};

export default function Derivatives({ derivativeType = "power" }) {
  const config = derivativeConfigs[derivativeType] || derivativeConfigs.power;

  const [expression, setExpression] = useState("");
  const [solution, setSolution] = useState(null);
  const [successiveSolution, setSuccessiveSolution] = useState(null);
  const [error, setError] = useState("");
  const [keyboardOpen, setKeyboardOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSolve(e) {
    e.preventDefault();
    setError("");
    setSolution(null);
    setSuccessiveSolution(null);
    setLoading(true);

    try {
      const res = await api.post(config.endpoint, { expression });

      if (derivativeType === "successive") {
        setSuccessiveSolution(res.data.solution);
      } else {
        setSolution(res.data.solution);
      }
    } catch (err) {
      setError(
        err?.response?.data?.error ||
          err?.response?.data?.message ||
          "No se pudo resolver la derivada."
      );
    } finally {
      setLoading(false);
    }
  }

  function appendValue(value) {
    setExpression((prev) => `${prev}${value}`);
  }

  function backspaceExpression() {
    setExpression((prev) => prev.slice(0, -1));
  }

  function clearExpression() {
    setExpression("");
    setSolution(null);
    setSuccessiveSolution(null);
    setError("");
  }

  return (
    <div style={pageStyle}>
      <Link
        to={
          ["constant", "sum", "subtraction", "power"].includes(derivativeType)
            ? "/derivatives/basic"
            : "/derivatives"
        }
        style={{
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
        }}
      >
        ← Volver
      </Link>

      <div style={heroStyle}>
        <p style={eyebrowStyle}>MÓDULO DE DERIVADAS</p>
        <h1 style={titleStyle}>{config.title}</h1>
        <p style={subtitleStyle}>{config.subtitle}</p>
      </div>

      <div style={mainGridStyle}>
        <div style={leftCardStyle}>
          <div style={cardHeaderStyle}>
            <div>
              <h2 style={sectionTitleStyle}>Constructor</h2>
              <p style={sectionSubStyle}>
                Usa el teclado matemático para escribir la función sin confundirte.
              </p>
            </div>
            <div style={badgeStyle}>Calclab</div>
          </div>

          <form onSubmit={handleSolve}>
            <button
              type="button"
              onClick={() => setKeyboardOpen(true)}
              style={fieldButtonStyle}
            >
              <div style={fieldLabelStyle}>Función</div>
              <div style={fieldValueStyle}>
                {expression || (
                  <span style={placeholderStyle}>
                    Toca para escribir la función
                  </span>
                )}
              </div>
            </button>

            <div style={tipBoxStyle}>
              <div style={tipTitleStyle}>Tip</div>
              <div style={tipTextStyle}>{config.tip}</div>
            </div>

            <div style={miniActionsStyle}>
              <button
                type="button"
                onClick={() => setKeyboardOpen(true)}
                style={softButtonStyle}
              >
                Editar función
              </button>

              <button
                type="button"
                onClick={clearExpression}
                style={dangerButtonStyle}
              >
                Limpiar
              </button>
            </div>

            <div style={miniActionsStyle}>
              <button
                type="button"
                onClick={backspaceExpression}
                style={softButtonStyle}
              >
                ⌫ Borrar
              </button>

              <button type="submit" style={solveButtonStyle} disabled={loading}>
                {loading ? "Resolviendo..." : config.buttonText}
              </button>
            </div>
          </form>

          <div style={examplesBoxStyle}>
            <div style={examplesTitleStyle}>Prueba estos ejemplos</div>
            <div style={examplesListStyle}>
              {config.examples.map((example, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => {
                    setExpression(example);
                    setSolution(null);
                    setSuccessiveSolution(null);
                    setError("");
                  }}
                  style={exampleButtonStyle}
                >
                  {example}
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
                {derivativeType === "successive"
                  ? "Aquí aparecen las derivadas sucesivas."
                  : "Aquí aparece el paso a paso de la derivada."}
              </p>
            </div>
          </div>

          {error && <div style={errorStyle}>{error}</div>}

          {!solution && !successiveSolution && !error && (
            <div style={emptyStateStyle}>{config.emptyText}</div>
          )}

          {solution && derivativeType !== "successive" && (
            <div>
              <div style={exerciseBoxStyle}>
                <div style={exerciseLabelStyle}>Función</div>
                <div style={exerciseValueStyle}>f(x) = {solution.expression}</div>
              </div>

              {solution.steps?.map((step, index) => (
                <div key={index} style={stepCardStyle}>
                  <div style={stepIndexStyle}>{index + 1}</div>
                  <div>
                    <div style={stepTitleStyle}>{step.title}</div>
                    <div style={stepTextStyle}>{step.content}</div>
                  </div>
                </div>
              ))}

              <div style={resultBoxStyle}>
                <span>Resultado final</span>
                <strong>f'(x) = {solution.result}</strong>
              </div>
            </div>
          )}

          {successiveSolution && derivativeType === "successive" && (
            <div>
              <div style={exerciseBoxStyle}>
                <div style={exerciseLabelStyle}>Función original</div>
                <div style={exerciseValueStyle}>
                  f(x) = {successiveSolution.expression}
                </div>
              </div>

              {successiveSolution.derivatives?.map((item, index) => (
                <div key={index} style={successiveCardStyle}>
                  <div style={successiveHeaderStyle}>
                    <span style={successiveLabelStyle}>{item.label}</span>
                    <span style={successiveResultStyle}>{item.result}</span>
                  </div>

                  <div style={miniStepBoxStyle}>
                    <div style={miniStepTitleStyle}>Entrada</div>
                    <div style={miniStepTextStyle}>{item.input}</div>
                  </div>

                  {item.steps?.map((step, stepIndex) => (
                    <div key={stepIndex} style={stepCardStyle}>
                      <div style={stepIndexStyle}>{stepIndex + 1}</div>
                      <div>
                        <div style={stepTitleStyle}>{step.title}</div>
                        <div style={stepTextStyle}>{step.content}</div>
                      </div>
                    </div>
                  ))}
                </div>
              ))}

              <div style={resultBoxStyle}>
                <span>Resultado final</span>
                <strong>{successiveSolution.finalResult}</strong>
              </div>
            </div>
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
                  Escribe la función que quieres derivar.
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

            <div style={keyboardPreviewStyle}>
              {expression || "La función aparecerá aquí"}
            </div>

            <div style={helperRowStyle}>
              <div style={helperPillStyle}>x = variable</div>
              <div style={helperPillStyle}>^ = potencia</div>
              <div style={helperPillStyle}>÷ = división</div>
            </div>

            <div style={{ ...keyboardGridStyle, gridTemplateColumns: "repeat(5, 1fr)" }}>
              {expressionKeys.map((key) => (
                <button
                  key={`${key.label}-${key.value}`}
                  type="button"
                  onClick={() => appendValue(key.value)}
                  style={getKeyboardButtonStyle(key.type)}
                >
                  {key.label}
                </button>
              ))}
            </div>

            <div style={keyboardActionsStyle}>
              <button type="button" onClick={backspaceExpression} style={softButtonStyle}>
                ⌫ Borrar
              </button>
              <button type="button" onClick={clearExpression} style={dangerButtonStyle}>
                Limpiar
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
    return { ...base, background: "rgba(37,99,235,0.20)" };
  }

  if (type === "variable" || type === "power" || type === "group") {
    return { ...base, background: "rgba(124,58,237,0.22)" };
  }

  return base;
}

const pageStyle = {
  padding: "24px 24px 36px",
  maxWidth: "1360px",
  margin: "0 auto",
};

const heroStyle = {
  marginBottom: "18px",
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
  gridTemplateColumns: "520px 1fr",
  gap: "18px",
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
};

const placeholderStyle = {
  color: "#64748b",
};

const tipBoxStyle = {
  marginTop: "12px",
  padding: "12px 14px",
  borderRadius: "14px",
  background: "rgba(15,23,42,0.45)",
  border: "1px solid rgba(255,255,255,0.06)",
};

const tipTitleStyle = {
  fontSize: "12px",
  fontWeight: "800",
  color: "#93c5fd",
  marginBottom: "6px",
};

const tipTextStyle = {
  fontSize: "13px",
  color: "#cbd5e1",
  lineHeight: "1.6",
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
  marginTop: "14px",
  padding: "14px",
  borderRadius: "16px",
  background: "rgba(15,23,42,0.45)",
  border: "1px solid rgba(255,255,255,0.06)",
};

const examplesTitleStyle = {
  fontSize: "13px",
  fontWeight: "800",
  color: "#93c5fd",
  marginBottom: "8px",
  textTransform: "uppercase",
  letterSpacing: "0.5px",
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
  fontSize: "13px",
  cursor: "pointer",
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
};

const stepCardStyle = {
  display: "flex",
  gap: "12px",
  background: "rgba(15,23,42,0.55)",
  border: "1px solid rgba(255,255,255,0.06)",
  borderRadius: "16px",
  padding: "14px",
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
  marginBottom: "6px",
  color: "#93c5fd",
  fontSize: "14px",
};

const stepTextStyle = {
  color: "#e2e8f0",
  lineHeight: "1.65",
  wordBreak: "break-word",
  fontSize: "14px",
};

const successiveCardStyle = {
  background: "rgba(15,23,42,0.50)",
  border: "1px solid rgba(255,255,255,0.06)",
  borderRadius: "18px",
  padding: "14px",
  marginBottom: "14px",
};

const successiveHeaderStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: "12px",
  marginBottom: "12px",
  flexWrap: "wrap",
};

const successiveLabelStyle = {
  color: "#93c5fd",
  fontWeight: "800",
  fontSize: "18px",
};

const successiveResultStyle = {
  fontWeight: "800",
  fontSize: "18px",
  color: "white",
};

const miniStepBoxStyle = {
  marginBottom: "12px",
  padding: "12px",
  borderRadius: "12px",
  background: "rgba(255,255,255,0.04)",
  border: "1px solid rgba(255,255,255,0.06)",
};

const miniStepTitleStyle = {
  fontSize: "12px",
  fontWeight: "800",
  color: "#93c5fd",
  marginBottom: "6px",
  textTransform: "uppercase",
};

const miniStepTextStyle = {
  color: "#e2e8f0",
  fontSize: "14px",
  wordBreak: "break-word",
};

const resultBoxStyle = {
  marginTop: "16px",
  padding: "16px",
  borderRadius: "16px",
  background: "linear-gradient(135deg, #2563eb, #7c3aed)",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  fontWeight: "800",
  fontSize: "18px",
  gap: "12px",
  flexWrap: "wrap",
};

const overlayStyle = {
  position: "fixed",
  inset: 0,
  background: "rgba(2,6,23,0.70)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "20px",
  zIndex: 999,
};

const keyboardModalStyle = {
  width: "min(740px, 100%)",
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
  fontSize: "22px",
  fontWeight: "800",
};

const keyboardSubStyle = {
  marginTop: "4px",
  color: "#cbd5e1",
  fontSize: "14px",
};

const closeButtonStyle = {
  width: "38px",
  height: "38px",
  borderRadius: "12px",
  border: "1px solid rgba(255,255,255,0.10)",
  background: "rgba(255,255,255,0.05)",
  color: "white",
  fontWeight: "800",
  cursor: "pointer",
};

const keyboardPreviewStyle = {
  minHeight: "60px",
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
};

const helperRowStyle = {
  display: "flex",
  gap: "8px",
  flexWrap: "wrap",
  marginBottom: "12px",
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
  padding: "14px 12px",
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