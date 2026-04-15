import { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
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
  { label: "√", value: "sqrt(", type: "special" },
  { label: "∛", value: "cbrt(", type: "special" },
];

const pointKeys = [
  { label: "7", value: "7", type: "number" },
  { label: "8", value: "8", type: "number" },
  { label: "9", value: "9", type: "number" },
  { label: "-", value: "-", type: "operator" },

  { label: "4", value: "4", type: "number" },
  { label: "5", value: "5", type: "number" },
  { label: "6", value: "6", type: "number" },
  { label: "∞", value: "infinity", type: "special" },

  { label: "1", value: "1", type: "number" },
  { label: "2", value: "2", type: "number" },
  { label: "3", value: "3", type: "number" },
  { label: "π", value: "pi", type: "special" },

  { label: "0", value: "0", type: "number" },
  { label: ".", value: ".", type: "number" },
];

const limitConfigs = {
  direct: {
    moduleName: "Sustitución directa",
    subtitle:
      "Para ejercicios donde se puede reemplazar x directamente sin transformar la expresión.",
    examples: [
      { label: "Polinomio simple", expression: "2*x+5", point: "3" },
      { label: "Potencia", expression: "5*x^2", point: "3" },
      { label: "Polinomio grado 3", expression: "x^3-5", point: "4" },
      { label: "Combinado", expression: "2*x^3-3*x+1", point: "5" },
    ],
  },

  indeterminate: {
    moduleName: "Indeterminaciones por factorización",
    subtitle:
      "Para casos 0/0 donde toca factorizar, cancelar y luego sustituir.",
    examples: [
      { label: "Diferencia cuadrados", expression: "(x^2-4)/(x-2)", point: "2" },
      { label: "Trinomio", expression: "(x^2+3*x+2)/(x+1)", point: "-1" },
      { label: "Cubo", expression: "(x^3-8)/(x-2)", point: "2" },
      { label: "Factor común", expression: "(x^2+x)/(3*x^2+2*x)", point: "0" },
    ],
  },

  radicals: {
  moduleName: "Límites con raíces",
  subtitle:
    "Para ejercicios con raíces donde toca racionalizar o simplificar antes de sustituir.",
  examples: [
    { label: "Raíz básica", expression: "(sqrt(x)-3)/(x-9)", point: "9" },
    { label: "Raíz desplazada", expression: "(sqrt(x+7)-4)/(x-9)", point: "9" },
    { label: "Raíz en el denominador", expression: "(x-9)/(sqrt(x)-3)", point: "9" },
    { label: "Otra racionalización", expression: "(x+2)/(sqrt(x+6)-2)", point: "-2" },
    { label: "Raíz simple", expression: "(sqrt(x)-2)/(x-4)", point: "4" },
    { label: "Raíz en numerador", expression: "(x-4)/(sqrt(x)-2)", point: "4" },
  ],
},

  infinite: {
    moduleName: "Límites al infinito",
    subtitle:
      "Para funciones cuando x tiende a infinito o menos infinito, dividiendo por la mayor potencia.",
    examples: [
      { label: "Mayor grado arriba", expression: "(6*x^2+2*x+3)/(x+1)", point: "infinity" },
    { label: "Mayor grado abajo", expression: "(7*x-9)/(x^3-8)", point: "infinity" },
    { label: "Mismo grado", expression: "(6*x^3+8*x-3)/(3*x^3+1)", point: "infinity" },
    { label: "Numerador menor", expression: "(7*x^4+8*x+2)/(3*x^6+1)", point: "infinity" },
    { label: "Cociente mismo grado", expression: "(4*x^3+8*x-3)/(x^3+7*x+1)", point: "infinity" },
    { label: "Tiende a cero", expression: "(5*x^2+1)/(2*x^5+3)", point: "infinity" },
    ],
  },
};

const defaultConfig = {
  moduleName: "Límites paso a paso",
  subtitle:
    "Calculadora compacta, teclado matemático emergente y desarrollo visual tipo cuaderno.",
  examples: [],
};

export default function LimitSolverPage() {

  const location = useLocation();
  const navigate = useNavigate();
  const routeKey = location.pathname.toLowerCase();

  const pageConfig =
  routeKey.includes("direct")
    ? limitConfigs.direct
    : routeKey.includes("indeterminate")
    ? limitConfigs.indeterminate
    : routeKey.includes("roots") || routeKey.includes("radicals") || routeKey.includes("raiz")
    ? limitConfigs.radicals
    : routeKey.includes("infinity") || routeKey.includes("infinite") || routeKey.includes("infinito")
    ? limitConfigs.infinite
    : defaultConfig;

  const [expression, setExpression] = useState("");
  const [point, setPoint] = useState("");
  const [activeField, setActiveField] = useState("expression");
  const [keyboardOpen, setKeyboardOpen] = useState(false);
  const [solution, setSolution] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const currentKeys = useMemo(
    () => (activeField === "expression" ? expressionKeys : pointKeys),
    [activeField]
  );

  function openKeyboard(field) {
    setActiveField(field);
    setKeyboardOpen(true);
  }

  function appendValue(value) {
    if (activeField === "expression") {
      setExpression((prev) => `${prev}${value}`);
    } else {
      setPoint((prev) => `${prev}${value}`);
    }
  }

  function backspaceActive() {
    if (activeField === "expression") {
      setExpression((prev) => prev.slice(0, -1));
    } else {
      setPoint((prev) => prev.slice(0, -1));
    }
  }

  function clearActive() {
    if (activeField === "expression") {
      setExpression("");
    } else {
      setPoint("");
    }
  }

  function clearAll() {
    setExpression("");
    setPoint("");
    setSolution(null);
    setError("");
  }

  function handleExampleSelect(example) {
    setExpression(example.expression);
    setPoint(example.point);
    setSolution(null);
    setError("");
  }

  function normalizePoint(value) {
    const raw = String(value ?? "").trim();
    if (!raw) return raw;

    const lowered = raw.toLowerCase();

    if (
      lowered === "infinity" ||
      lowered === "∞" ||
      lowered === "infinito" ||
      lowered === "inf"
    ) {
      return "infinity";
    }

    return raw;
  }

  async function handleSolve(e) {
    e.preventDefault();
    setError("");
    setSolution(null);
    setLoading(true);

    try {
      const normalizedPoint = normalizePoint(point);

      const payload = {
        expression,
        tendsTo: normalizedPoint,
        point: normalizedPoint,
      };

      const res = await api.post("/math/limit", payload);
      const maybeSolution = res?.data?.solution ?? res?.data;

      if (!maybeSolution) {
        throw new Error("La respuesta del servidor llegó vacía.");
      }

      setSolution(maybeSolution);
    } catch (err) {
      setError(
        err?.response?.data?.error ||
          err?.response?.data?.message ||
          err?.message ||
          "No se pudo resolver el límite."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    
  <div style={pageStyle}>
    <div style={{ marginBottom: "16px" }}>
      <button
        type="button"
        onClick={() => navigate("/limits")}
        style={{
          padding: "10px 16px",
          borderRadius: "12px",
          border: "1px solid rgba(255,255,255,0.10)",
          background: "rgba(255,255,255,0.06)",
          color: "white",
          fontWeight: "700",
          cursor: "pointer",
        }}
      >
        ← Volver al menú de límites
      </button>
    </div>

    <div style={heroStyle}>
      <p style={eyebrowStyle}>MÓDULO DE LÍMITES</p>
      <h1 style={titleStyle}>{pageConfig.moduleName}</h1>
      <p style={subtitleStyle}>{pageConfig.subtitle}</p>
    </div>

      <div style={mainGridStyle}>
        <div style={leftCardStyle}>
          <div style={cardHeaderStyle}>
            <div>
              <h2 style={sectionTitleStyle}>Constructor</h2>
              <p style={sectionSubStyle}>
                Toca un campo para escribir con el teclado matemático.
              </p>
            </div>
            <div style={badgeStyle}>CalcLab</div>
          </div>

          <form onSubmit={handleSolve}>
            <button
              type="button"
              onClick={() => openKeyboard("expression")}
              style={{
                ...fieldButtonStyle,
                ...(activeField === "expression" ? activeFieldStyle : {}),
              }}
            >
              <div style={fieldLabelStyle}>Expresión</div>
              <div style={fieldValueStyle}>
                {expression || (
                  <span style={placeholderStyle}>
                    Toca para escribir el límite
                  </span>
                )}
              </div>
            </button>

            <button
              type="button"
              onClick={() => openKeyboard("point")}
              style={{
                ...fieldButtonStyle,
                marginTop: "12px",
                ...(activeField === "point" ? activeFieldStyle : {}),
              }}
            >
              <div style={fieldLabelStyle}>x tiende a</div>
              <div style={fieldValueStyle}>
                {point || (
                  <span style={placeholderStyle}>
                    Toca para escribir el punto
                  </span>
                )}
              </div>
            </button>

            <div style={examplesBoxStyle}>
              <div style={examplesTitleStyle}>Ejemplos rápidos</div>
              <div style={exampleGridStyle}>
                {pageConfig.examples.map((example) => (
                  <button
                    key={`${example.label}-${example.expression}-${example.point}`}
                    type="button"
                    onClick={() => handleExampleSelect(example)}
                    style={exampleButtonStyle}
                  >
                    <div style={exampleLabelStyle}>{example.label}</div>
                    <div style={exampleTextStyle}>{example.expression}</div>
                    <div style={examplePointStyle}>x → {example.point}</div>
                  </button>
                ))}
              </div>
            </div>

            <div style={miniActionsStyle}>
              <button
                type="button"
                onClick={() => openKeyboard("expression")}
                style={softButtonStyle}
              >
                Editar expresión
              </button>

              <button
                type="button"
                onClick={() => openKeyboard("point")}
                style={softButtonStyle}
              >
                Editar punto
              </button>
            </div>

            <div style={miniActionsStyle}>
              <button
                type="button"
                onClick={backspaceActive}
                style={softButtonStyle}
              >
                ⌫ Borrar activo
              </button>

              <button
                type="button"
                onClick={clearActive}
                style={dangerButtonStyle}
              >
                Limpiar activo
              </button>
            </div>

            <div style={miniActionsStyle}>
              <button
                type="button"
                onClick={clearAll}
                style={dangerButtonStyle}
              >
                Limpiar todo
              </button>

              <button type="submit" style={solveButtonStyle} disabled={loading}>
                {loading ? "Resolviendo..." : "Resolver límite"}
              </button>
            </div>
          </form>
        </div>

        

        <div style={rightCardStyle}>
          <div style={cardHeaderStyle}>
            <div>
              <h2 style={sectionTitleStyle}>Solución</h2>
              <p style={sectionSubStyle}>
                Aquí aparece el procedimiento paso a paso.
              </p>
            </div>
          </div>

          {error && <div style={errorStyle}>{error}</div>}

          {!solution && !error && (
            <div style={emptyStateStyle}>
              Aquí aparecerá la explicación completa del límite.
            </div>
          )}

          {solution && (
            <>
              <div style={exerciseBoxStyle}>
                <div style={exerciseLabelStyle}>Ejercicio</div>
                <div style={exerciseValueStyle}>
                  lim x→{solution.tendsTo ?? solution.point ?? point} (
                  {solution.expression ?? expression})
                </div>
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
                <strong>{solution.result}</strong>
              </div>
            </>
          )}
        </div>
      </div>

      {keyboardOpen && (
        <div style={overlayStyle} onClick={() => setKeyboardOpen(false)}>
          <div style={keyboardModalStyle} onClick={(e) => e.stopPropagation()}>
            <div style={keyboardHeaderStyle}>
              <div>
                <div style={keyboardTitleStyle}>Teclado matemático</div>
                <div style={keyboardSubStyle}>
                  Escribiendo en:{" "}
                  <strong>
                    {activeField === "expression" ? "Expresión" : "x tiende a"}
                  </strong>
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
              {activeField === "expression"
                ? expression || "La expresión aparecerá aquí"
                : point || "El punto aparecerá aquí"}
            </div>

            <div
              style={{
                ...keyboardGridStyle,
                gridTemplateColumns:
                  activeField === "expression"
                    ? "repeat(5, 1fr)"
                    : "repeat(4, 1fr)",
              }}
            >
              {currentKeys.map((key) => (
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
              <button
                type="button"
                onClick={backspaceActive}
                style={softButtonStyle}
              >
                ⌫ Borrar
              </button>

              <button
                type="button"
                onClick={clearActive}
                style={dangerButtonStyle}
              >
                Limpiar
              </button>

              <button
                type="button"
                onClick={() =>
                  setActiveField((prev) =>
                    prev === "expression" ? "point" : "expression"
                  )
                }
                style={softButtonStyle}
              >
                Cambiar campo
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

  if (type === "variable" || type === "group" || type === "special") {
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
  background:
    "linear-gradient(180deg, rgba(255,255,255,0.06), rgba(255,255,255,0.03))",
  border: "1px solid rgba(255,255,255,0.08)",
  borderRadius: "24px",
  padding: "18px",
  boxShadow: "0 16px 34px rgba(0,0,0,0.22)",
};

const rightCardStyle = {
  background:
    "linear-gradient(180deg, rgba(255,255,255,0.06), rgba(255,255,255,0.03))",
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

const activeFieldStyle = {
  boxShadow: "0 0 0 1px rgba(96,165,250,0.35) inset",
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

const examplesBoxStyle = {
  marginTop: "14px",
  padding: "14px",
  borderRadius: "16px",
  background: "rgba(15,23,42,0.35)",
  border: "1px solid rgba(255,255,255,0.06)",
};

const examplesTitleStyle = {
  color: "#93c5fd",
  fontWeight: "800",
  marginBottom: "10px",
  fontSize: "13px",
  textTransform: "uppercase",
  letterSpacing: "0.5px",
};

const exampleGridStyle = {
  display: "grid",
  gap: "8px",
};

const exampleButtonStyle = {
  width: "100%",
  padding: "10px",
  borderRadius: "12px",
  background: "rgba(255,255,255,0.05)",
  color: "white",
  border: "1px solid rgba(255,255,255,0.06)",
  textAlign: "left",
  cursor: "pointer",
};

const exampleLabelStyle = {
  fontSize: "12px",
  fontWeight: "800",
  color: "#bfdbfe",
  marginBottom: "4px",
};

const exampleTextStyle = {
  fontSize: "13px",
  color: "#e2e8f0",
  wordBreak: "break-word",
};

const examplePointStyle = {
  fontSize: "12px",
  color: "#94a3b8",
  marginTop: "4px",
};

const miniActionsStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(2, 1fr)",
  gap: "10px",
  marginTop: "12px",
};

const softButtonStyle = {
  padding: "12px",
  borderRadius: "12px",
  background: "rgba(255,255,255,0.05)",
  color: "white",
  border: "1px solid rgba(255,255,255,0.08)",
  cursor: "pointer",
};

const dangerButtonStyle = {
  padding: "12px",
  borderRadius: "12px",
  background: "rgba(239,68,68,0.22)",
  color: "white",
  border: "none",
  cursor: "pointer",
};

const solveButtonStyle = {
  padding: "12px",
  borderRadius: "12px",
  background: "linear-gradient(135deg,#2563eb,#7c3aed)",
  color: "white",
  border: "none",
  cursor: "pointer",
};

const errorStyle = {
  background: "rgba(239,68,68,0.15)",
  padding: "14px",
  borderRadius: "12px",
  color: "#fecaca",
};

const emptyStateStyle = {
  padding: "18px",
  borderRadius: "16px",
  color: "#94a3b8",
  background: "rgba(15,23,42,0.4)",
  border: "1px dashed rgba(255,255,255,0.08)",
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
  padding: "14px",
  marginBottom: "10px",
  background: "rgba(15,23,42,0.55)",
  borderRadius: "16px",
  border: "1px solid rgba(255,255,255,0.06)",
};

const stepIndexStyle = {
  width: "30px",
  height: "30px",
  borderRadius: "999px",
  background: "rgba(96,165,250,0.18)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: "#dbeafe",
  fontWeight: "800",
};

const stepTitleStyle = {
  fontWeight: "800",
  color: "#93c5fd",
  marginBottom: "4px",
};

const stepTextStyle = {
  color: "#e2e8f0",
  lineHeight: "1.6",
  wordBreak: "break-word",
};

const resultBoxStyle = {
  marginTop: "16px",
  padding: "16px",
  borderRadius: "16px",
  background: "linear-gradient(135deg,#2563eb,#7c3aed)",
  display: "flex",
  justifyContent: "space-between",
  gap: "12px",
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
  width: "min(720px,100%)",
  background: "rgba(15,23,42,0.98)",
  borderRadius: "24px",
  padding: "18px",
  border: "1px solid rgba(255,255,255,0.10)",
  boxShadow: "0 25px 60px rgba(0,0,0,0.35)",
};

const keyboardHeaderStyle = {
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
  padding: "14px",
  background: "rgba(255,255,255,0.04)",
  marginBottom: "14px",
  color: "white",
  display: "flex",
  alignItems: "center",
  wordBreak: "break-word",
};

const keyboardGridStyle = {
  display: "grid",
  gap: "10px",
};

const keyboardButtonStyle = {
  padding: "14px",
  borderRadius: "14px",
  background: "rgba(255,255,255,0.06)",
  color: "white",
  border: "none",
  cursor: "pointer",
};

const keyboardActionsStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(4,1fr)",
  gap: "10px",
  marginTop: "14px",
};