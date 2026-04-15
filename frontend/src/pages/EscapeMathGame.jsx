import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function shuffleArray(arr) {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function createGameSession() {
  const faciles = shuffleArray([
    {
      question: "d/dx (x³)",
      options: ["3x²", "x²", "3x", "x³"],
      answer: "3x²",
      explanation: "Se aplica la regla de la potencia.",
      difficulty: "Fácil",
    },
    {
      question: "d/dx (5x²)",
      options: ["10x", "5x", "2x", "10"],
      answer: "10x",
      explanation: "La derivada de x² es 2x, entonces 5·2x = 10x.",
      difficulty: "Fácil",
    },
    {
      question: "lim x→0 sen(x)/x",
      options: ["0", "1", "∞", "-1"],
      answer: "1",
      explanation: "Es un límite notable fundamental.",
      difficulty: "Fácil",
    },
    {
      question: "lim x→1 (x+4)",
      options: ["4", "5", "6", "3"],
      answer: "5",
      explanation: "Sustituyendo x=1: 1+4 = 5.",
      difficulty: "Fácil",
    },
  ]);

  const medias = shuffleArray([
    {
      question: "lim x→2 (x²-4)/(x-2)",
      options: ["2", "4", "6", "8"],
      answer: "4",
      explanation: "Se factoriza: (x-2)(x+2)/(x-2) = x+2 y luego 2+2 = 4.",
      difficulty: "Media",
    },
    {
      question: "lim x→∞ (2x²+1)/(x²)",
      options: ["2", "1", "∞", "0"],
      answer: "2",
      explanation: "Se divide por x² y queda 2 + 1/x², que tiende a 2.",
      difficulty: "Media",
    },
    {
      question: "d/dx (4x³)",
      options: ["12x²", "8x", "4x²", "12x"],
      answer: "12x²",
      explanation: "4·3x² = 12x².",
      difficulty: "Media",
    },
  ]);

  const dificiles = shuffleArray([
    {
      question: "lim x→9 (√x-3)/(x-9)",
      options: ["1/6", "1/3", "1/9", "3"],
      answer: "1/6",
      explanation: "Se racionaliza con el conjugado.",
      difficulty: "Difícil",
    },
    {
      question: "d/dx (2x⁵)",
      options: ["10x⁴", "8x⁴", "5x⁴", "2x⁴"],
      answer: "10x⁴",
      explanation: "2·5x⁴ = 10x⁴.",
      difficulty: "Difícil",
    },
  ]);

  return [faciles[0], faciles[1], medias[0], medias[1], dificiles[0]];
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

const barContainerStyle = {
  height: "14px",
  width: "100%",
  background: "rgba(255,255,255,0.08)",
  borderRadius: "999px",
  overflow: "hidden",
};

const barFillStyle = {
  height: "100%",
  borderRadius: "999px",
  transition: "width 0.4s ease",
};

export default function EscapeMathGame() {
  const navigate = useNavigate();

  const [questions, setQuestions] = useState(() => createGameSession());
  const [questionIndex, setQuestionIndex] = useState(0);
  const [message, setMessage] = useState("");
  const [finished, setFinished] = useState(false);
  const [lost, setLost] = useState(false);
  const [lives, setLives] = useState(3);
  const [timeLeft, setTimeLeft] = useState(20);
  const [coins, setCoins] = useState(0);
  const [streak, setStreak] = useState(0);

  const current = questions[questionIndex];

  useEffect(() => {
    if (finished || lost || !current) return;

    const timer = setTimeout(() => {
      setTimeLeft((prevTime) => {
        if (prevTime > 1) return prevTime - 1;

        setLives((prevLives) => {
          const newLives = prevLives - 1;
          setStreak(0);

          if (newLives <= 0) {
            setLost(true);
            setMessage("💀 Se acabó el tiempo. Perdiste todas las vidas.");
            return 0;
          }

          setMessage(`⏰ Tiempo agotado. Te quedan ${newLives} vidas.`);
          return newLives;
        });

        return 20;
      });
    }, 1000);

    return () => clearTimeout(timer);
  }, [timeLeft, finished, lost, current]);

  function startGame() {
    setQuestions(createGameSession());
    setQuestionIndex(0);
    setMessage("");
    setFinished(false);
    setLost(false);
    setLives(3);
    setTimeLeft(20);
    setCoins(0);
    setStreak(0);
  }

  function goNextQuestion() {
    setQuestionIndex((prevIndex) => {
      if (prevIndex >= questions.length - 1) {
        setFinished(true);
        setMessage("🏆 ¡Escapaste del laboratorio!");
        return prevIndex;
      }
      return prevIndex + 1;
    });

    setTimeLeft(20);
  }

  function checkAnswer(option) {
    if (finished || lost || !current) return;

    if (option === current.answer) {
      const bonus = streak >= 2 ? 5 : 0;
      const reward = 10 + bonus;

      setCoins((prev) => prev + reward);
      setStreak((prev) => prev + 1);
      setMessage(`✅ Correcto. ${current.explanation} 🪙 +${reward} monedas`);

      setTimeout(() => {
        goNextQuestion();
      }, 1000);
    } else {
      setLives((prevLives) => {
        const newLives = prevLives - 1;
        setStreak(0);

        if (newLives <= 0) {
          setLost(true);
          setMessage(`💀 Incorrecto. ${current.explanation}`);
          return 0;
        }

        setMessage(`❌ Incorrecto. ${current.explanation} | Vidas: ${newLives}`);
        return newLives;
      });
    }
  }

  const progressPercent =
    questions.length > 0
      ? ((questionIndex + (finished ? 1 : 0)) / questions.length) * 100
      : 0;

  const timerColor =
    timeLeft > 12 ? "#22c55e" : timeLeft > 6 ? "#f59e0b" : "#ef4444";

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
            <h1 style={{ margin: 0, fontSize: "36px" }}>🔐 Escape Matemático</h1>
            <p style={{ color: "#9fb3d9", marginTop: "8px" }}>
              Resuelve correctamente para escapar del laboratorio.
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
            <div style={hudLabelStyle}>Monedas</div>
            <div style={hudValueStyle}>🪙 {coins}</div>
          </div>
          <div style={hudCardStyle}>
            <div style={hudLabelStyle}>Vidas</div>
            <div style={hudValueStyle}>❤️ {lives}</div>
          </div>
          <div style={hudCardStyle}>
            <div style={hudLabelStyle}>Tiempo</div>
            <div style={{ ...hudValueStyle, color: timerColor }}>⏳ {timeLeft}s</div>
          </div>
          <div style={hudCardStyle}>
            <div style={hudLabelStyle}>Sala</div>
            <div style={hudValueStyle}>
              🚪 {Math.min(questionIndex + 1, questions.length)}/{questions.length}
            </div>
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1.1fr 0.9fr",
            gap: "18px",
          }}
        >
          <div>
            <div style={panelStyle}>
              <div style={{ marginBottom: "14px" }}>
                <div
                  style={{
                    marginBottom: "8px",
                    fontWeight: "800",
                    color: "#bfdbfe",
                    fontSize: "14px",
                  }}
                >
                  Progreso de escape
                </div>
                <div style={barContainerStyle}>
                  <div
                    style={{
                      ...barFillStyle,
                      width: `${progressPercent}%`,
                      background: "linear-gradient(90deg,#3b82f6,#7c3aed)",
                    }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: "18px" }}>
                <div
                  style={{
                    marginBottom: "8px",
                    fontWeight: "800",
                    color: "#bfdbfe",
                    fontSize: "14px",
                  }}
                >
                  Tiempo restante
                </div>
                <div style={barContainerStyle}>
                  <div
                    style={{
                      ...barFillStyle,
                      width: `${(timeLeft / 20) * 100}%`,
                      background:
                        timeLeft > 12
                          ? "linear-gradient(90deg,#22c55e,#3b82f6)"
                          : timeLeft > 6
                          ? "linear-gradient(90deg,#f59e0b,#f97316)"
                          : "linear-gradient(90deg,#ef4444,#dc2626)",
                    }}
                  />
                </div>
              </div>

              <div
                style={{
                  background: "rgba(34,51,102,0.55)",
                  borderRadius: "18px",
                  padding: "18px",
                  border: "1px solid rgba(255,255,255,0.08)",
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
                  <span>🔒 Laboratorio</span>
                  <span>📘 Dificultad: {current?.difficulty || "—"}</span>
                </div>

                <div
                  style={{
                    position: "relative",
                    height: "170px",
                    borderRadius: "16px",
                    overflow: "hidden",
                    border: "1px solid rgba(255,255,255,0.08)",
                    background:
                      "linear-gradient(180deg, rgba(30,41,59,0.9), rgba(15,23,42,0.95))",
                  }}
                >
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      background:
                        "repeating-linear-gradient(90deg, rgba(255,255,255,0.03) 0 50px, rgba(255,255,255,0.01) 50px 100px)",
                    }}
                  />

                  <div
                    style={{
                      position: "absolute",
                      left: "24px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      fontSize: "72px",
                    }}
                  >
                    🧑‍🔬
                  </div>

                  <div
                    style={{
                      position: "absolute",
                      right: "28px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      fontSize: "78px",
                    }}
                  >
                    🚪
                  </div>

                  <div
                    style={{
                      position: "absolute",
                      left: "110px",
                      right: "120px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      height: "10px",
                      borderRadius: "999px",
                      background: "rgba(255,255,255,0.08)",
                    }}
                  >
                    <div
                      style={{
                        height: "100%",
                        width: `${progressPercent}%`,
                        borderRadius: "999px",
                        background: "linear-gradient(90deg,#3b82f6,#7c3aed)",
                        transition: "width 0.4s ease",
                      }}
                    />
                  </div>

                  <div
                    style={{
                      position: "absolute",
                      left: "24px",
                      bottom: "16px",
                      fontSize: "14px",
                      color: "#bfdbfe",
                      fontWeight: "800",
                    }}
                  >
                    Tú
                  </div>

                  <div
                    style={{
                      position: "absolute",
                      right: "28px",
                      bottom: "16px",
                      fontSize: "14px",
                      color: "#c4b5fd",
                      fontWeight: "800",
                    }}
                  >
                    Salida
                  </div>
                </div>
              </div>
            </div>

            <div style={{ ...panelStyle, marginTop: "14px", fontSize: "15px" }}>
              {message || "Responde para avanzar hacia la salida."}
            </div>
          </div>

          <div>
            {!finished && !lost && current && (
              <div style={panelStyle}>
                <div
                  style={{
                    fontSize: "22px",
                    textAlign: "center",
                    marginBottom: "18px",
                    lineHeight: "1.5",
                  }}
                >
                  {current.question}
                </div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "12px",
                  }}
                >
                  {current.options.map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => checkAnswer(option)}
                      style={{
                        padding: "14px",
                        borderRadius: "14px",
                        border: "none",
                        background: "linear-gradient(135deg, #2563eb, #3b82f6)",
                        color: "white",
                        fontWeight: "800",
                        cursor: "pointer",
                      }}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {(finished || lost) && (
              <button
                type="button"
                onClick={startGame}
                style={{
                  width: "100%",
                  padding: "14px",
                  borderRadius: "14px",
                  border: "none",
                  background: "linear-gradient(90deg,#3b82f6,#7c3aed)",
                  color: "white",
                  fontWeight: "800",
                  cursor: "pointer",
                }}
              >
                🔁 Jugar otra vez
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}