import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

function shuffleArray(arr) {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

const PUZZLES = [
  {
    id: 1,
    topic: "Límites por factorización",
    title: "Ordena los pasos",
    difficulty: "Media",
    exercise: "lim x→2 (x² - 4) / (x - 2)",
    orderedSteps: [
      "Sustituir x=2 y obtener 0/0",
      "Factorizar x²-4 como (x-2)(x+2)",
      "Cancelar el factor común (x-2)",
      "Evaluar x+2 en x=2",
      "Resultado final: 4",
    ],
    hint: "Primero mira si al sustituir aparece una indeterminación.",
  },
  {
    id: 2,
    topic: "Límites con raíz",
    title: "Ordena los pasos",
    difficulty: "Difícil",
    exercise: "lim x→9 (√x - 3) / (x - 9)",
    orderedSteps: [
      "Sustituir x=9 y obtener 0/0",
      "Multiplicar por el conjugado √x+3",
      "Aplicar diferencia de cuadrados en el numerador",
      "Cancelar el factor común (x-9)",
      "Evaluar 1/(√9+3) y obtener 1/6",
    ],
    hint: "Cuando hay raíz y aparece 0/0, piensa en racionalizar.",
  },
  {
    id: 3,
    topic: "Derivadas básicas",
    title: "Ordena los pasos",
    difficulty: "Fácil",
    exercise: "d/dx (5x²)",
    orderedSteps: [
      "Identificar el coeficiente 5",
      "Aplicar la regla de la potencia a x²",
      "Derivar x² como 2x",
      "Multiplicar 5 por 2x",
      "Resultado final: 10x",
    ],
    hint: "El coeficiente se conserva y luego se deriva la potencia.",
  },
  {
    id: 4,
    topic: "Límites al infinito",
    title: "Ordena los pasos",
    difficulty: "Media",
    exercise: "lim x→∞ (2x² + 1) / x²",
    orderedSteps: [
      "Dividir cada término del numerador y denominador por x²",
      "Reescribir como (2 + 1/x²) / 1",
      "Analizar que 1/x² tiende a 0",
      "Sustituir el término que tiende a 0",
      "Resultado final: 2",
    ],
    hint: "En infinito, divide por la mayor potencia de x.",
  },
  {
    id: 5,
    topic: "Derivadas",
    title: "Ordena los pasos",
    difficulty: "Media",
    exercise: "d/dx (4x³)",
    orderedSteps: [
      "Identificar el coeficiente 4",
      "Aplicar la regla de la potencia a x³",
      "Derivar x³ como 3x²",
      "Multiplicar 4 por 3x²",
      "Resultado final: 12x²",
    ],
    hint: "Primero conserva el coeficiente y luego deriva la potencia.",
  },
];

function createPuzzleSession() {
  const puzzle = PUZZLES[Math.floor(Math.random() * PUZZLES.length)];
  return {
    ...puzzle,
    shuffledSteps: shuffleArray(puzzle.orderedSteps),
  };
}

const hudCardStyle = {
  background: "rgba(255,255,255,0.05)",
  border: "1px solid rgba(255,255,255,0.08)",
  borderRadius: "18px",
  padding: "14px",
};

const hudLabelStyle = {
  fontSize: "12px",
  color: "#94a3b8",
  fontWeight: "800",
};

const hudValueStyle = {
  fontSize: "21px",
  fontWeight: "900",
};

const panelStyle = {
  background: "rgba(255,255,255,0.04)",
  border: "1px solid rgba(255,255,255,0.08)",
  borderRadius: "20px",
  padding: "18px",
};

export default function PuzzleStepsGame() {
  const navigate = useNavigate();

  const initialPuzzle = useMemo(() => createPuzzleSession(), []);
  const [puzzle, setPuzzle] = useState(initialPuzzle);
  const [steps, setSteps] = useState(initialPuzzle.shuffledSteps);
  const [message, setMessage] = useState("Ordena correctamente los pasos para resolver el ejercicio.");
  const [attempts, setAttempts] = useState(3);
  const [solved, setSolved] = useState(false);

  function moveStepUp(index) {
    if (index === 0 || solved) return;
    const updated = [...steps];
    [updated[index - 1], updated[index]] = [updated[index], updated[index - 1]];
    setSteps(updated);
  }

  function moveStepDown(index) {
    if (index === steps.length - 1 || solved) return;
    const updated = [...steps];
    [updated[index], updated[index + 1]] = [updated[index + 1], updated[index]];
    setSteps(updated);
  }

  function validateOrder() {
    const isCorrect =
      JSON.stringify(steps) === JSON.stringify(puzzle.orderedSteps);

    if (isCorrect) {
      setSolved(true);
      setMessage("✅ ¡Orden correcto! Resolviste el puzzle.");
      return;
    }

    const newAttempts = attempts - 1;
    setAttempts(newAttempts);

    if (newAttempts <= 0) {
      setMessage("💀 Te quedaste sin intentos. Puedes reiniciar o ver la solución.");
      return;
    }

    setMessage(`❌ El orden aún no es correcto. Pista: ${puzzle.hint}`);
  }

  function resetPuzzle() {
    const newPuzzle = createPuzzleSession();
    setPuzzle(newPuzzle);
    setSteps(newPuzzle.shuffledSteps);
    setMessage("Ordena correctamente los pasos para resolver el ejercicio.");
    setAttempts(3);
    setSolved(false);
  }

  function showSolution() {
    setSteps(puzzle.orderedSteps);
    setMessage("📘 Aquí tienes el orden correcto de los pasos.");
  }

  const progressPercent = ((puzzle.orderedSteps.length - attempts + 1) / puzzle.orderedSteps.length) * 100;

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "radial-gradient(circle at top, #0f1b3d 0%, #081226 55%, #050b18 100%)",
        color: "white",
        padding: "18px 24px 32px",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "1240px",
          margin: "0 auto",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "18px",
          }}
        >
          <button
            type="button"
            onClick={() => navigate("/playlab")}
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
            ← Volver al menú
          </button>

          <div style={{ textAlign: "center", flex: 1 }}>
            <h1 style={{ margin: 0, fontSize: "36px" }}>🧩 Puzzle de Pasos</h1>
            <p style={{ color: "#9fb3d9", marginTop: "8px" }}>
              Organiza los pasos correctos para resolver el ejercicio.
            </p>
          </div>

          <div style={{ width: "150px" }} />
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
            gap: "14px",
            marginBottom: "18px",
          }}
        >
          <div style={hudCardStyle}>
            <div style={hudLabelStyle}>Tema</div>
            <div style={{ ...hudValueStyle, fontSize: "18px" }}>📚 {puzzle.topic}</div>
          </div>
          <div style={hudCardStyle}>
            <div style={hudLabelStyle}>Intentos</div>
            <div style={hudValueStyle}>🎯 {attempts}</div>
          </div>
          <div style={hudCardStyle}>
            <div style={hudLabelStyle}>Estado</div>
            <div style={{ ...hudValueStyle, fontSize: "18px" }}>
              {solved ? "✅ Resuelto" : "🧠 En proceso"}
            </div>
          </div>
          <div style={hudCardStyle}>
            <div style={hudLabelStyle}>Dificultad</div>
            <div style={{ ...hudValueStyle, fontSize: "18px" }}>📘 {puzzle.difficulty}</div>
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1.05fr 0.95fr",
            gap: "18px",
          }}
        >
          <div>
            <div style={panelStyle}>
              <div
                style={{
                  marginBottom: "14px",
                  fontWeight: "800",
                  color: "#bfdbfe",
                  fontSize: "14px",
                }}
              >
                Progreso del puzzle
              </div>

              <div
                style={{
                  height: "14px",
                  width: "100%",
                  background: "rgba(255,255,255,0.08)",
                  borderRadius: "999px",
                  overflow: "hidden",
                  marginBottom: "18px",
                }}
              >
                <div
                  style={{
                    height: "100%",
                    width: `${Math.min(progressPercent, 100)}%`,
                    borderRadius: "999px",
                    background: "linear-gradient(90deg,#3b82f6,#7c3aed)",
                    transition: "width 0.4s ease",
                  }}
                />
              </div>

              <div
                style={{
                  background: "rgba(34,51,102,0.55)",
                  borderRadius: "18px",
                  padding: "18px",
                  border: "1px solid rgba(255,255,255,0.08)",
                  marginBottom: "18px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "10px",
                    color: "#93c5fd",
                    fontWeight: "800",
                    fontSize: "14px",
                  }}
                >
                  <span>📝 Ejercicio</span>
                  <span>🔢 Pasos: {steps.length}</span>
                </div>

                <div
                  style={{
                    fontSize: "22px",
                    textAlign: "center",
                    lineHeight: "1.5",
                    padding: "18px",
                    borderRadius: "16px",
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.08)",
                  }}
                >
                  {puzzle.exercise}
                </div>
              </div>

              <div style={{ display: "grid", gap: "12px" }}>
                {steps.map((step, index) => (
                  <div
                    key={`${step}-${index}`}
                    style={{
                      background: "rgba(255,255,255,0.05)",
                      border: "1px solid rgba(255,255,255,0.08)",
                      borderRadius: "16px",
                      padding: "14px",
                      display: "grid",
                      gridTemplateColumns: "1fr auto",
                      gap: "14px",
                      alignItems: "center",
                    }}
                  >
                    <div>
                      <div
                        style={{
                          fontSize: "12px",
                          color: "#93c5fd",
                          fontWeight: "800",
                          marginBottom: "6px",
                          textTransform: "uppercase",
                        }}
                      >
                        Paso {index + 1}
                      </div>
                      <div style={{ fontSize: "17px", lineHeight: "1.5" }}>{step}</div>
                    </div>

                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "8px",
                      }}
                    >
                      <button
                        type="button"
                        onClick={() => moveStepUp(index)}
                        disabled={index === 0 || solved}
                        style={{
                          padding: "10px 12px",
                          borderRadius: "10px",
                          border: "none",
                          background: index === 0 || solved ? "#334155" : "#2563eb",
                          color: "white",
                          cursor: index === 0 || solved ? "not-allowed" : "pointer",
                          fontWeight: "700",
                        }}
                      >
                        ↑ Subir
                      </button>

                      <button
                        type="button"
                        onClick={() => moveStepDown(index)}
                        disabled={index === steps.length - 1 || solved}
                        style={{
                          padding: "10px 12px",
                          borderRadius: "10px",
                          border: "none",
                          background:
                            index === steps.length - 1 || solved ? "#334155" : "#7c3aed",
                          color: "white",
                          cursor:
                            index === steps.length - 1 || solved ? "not-allowed" : "pointer",
                          fontWeight: "700",
                        }}
                      >
                        ↓ Bajar
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ ...panelStyle, marginTop: "14px", fontSize: "15px" }}>
              {message}
            </div>
          </div>

          <div>
            <div style={panelStyle}>
              <div
                style={{
                  fontSize: "20px",
                  fontWeight: "800",
                  marginBottom: "16px",
                  textAlign: "center",
                }}
              >
                Controles del puzzle
              </div>

              <div
                style={{
                  display: "grid",
                  gap: "12px",
                }}
              >
                <button
                  type="button"
                  onClick={validateOrder}
                  disabled={solved || attempts <= 0}
                  style={{
                    padding: "16px",
                    borderRadius: "14px",
                    border: "none",
                    background: solved || attempts <= 0 ? "#334155" : "linear-gradient(135deg,#16a34a,#22c55e)",
                    color: "white",
                    fontWeight: "800",
                    cursor: solved || attempts <= 0 ? "not-allowed" : "pointer",
                  }}
                >
                  ✅ Validar orden
                </button>

                <button
                  type="button"
                  onClick={showSolution}
                  style={{
                    padding: "16px",
                    borderRadius: "14px",
                    border: "none",
                    background: "linear-gradient(135deg,#f59e0b,#f97316)",
                    color: "white",
                    fontWeight: "800",
                    cursor: "pointer",
                  }}
                >
                  📘 Ver solución
                </button>

                <button
                  type="button"
                  onClick={resetPuzzle}
                  style={{
                    padding: "16px",
                    borderRadius: "14px",
                    border: "none",
                    background: "linear-gradient(135deg,#3b82f6,#7c3aed)",
                    color: "white",
                    fontWeight: "800",
                    cursor: "pointer",
                  }}
                >
                  🔁 Nuevo puzzle
                </button>
              </div>

              <div
                style={{
                  marginTop: "18px",
                  padding: "16px",
                  borderRadius: "16px",
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  fontSize: "14px",
                  lineHeight: "1.6",
                  color: "#cbd5e1",
                }}
              >
                <strong style={{ color: "white" }}>Consejo:</strong> empieza revisando
                qué paso debería ir primero. Luego piensa qué simplificación o regla
                viene después.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}