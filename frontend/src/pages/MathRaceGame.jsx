import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const QUESTION_BANK = [
  {
    question: "d/dx (x²)",
    options: ["2x", "x", "x²", "2"],
    answer: "2x",
    explanation: "La derivada de x² es 2x.",
    difficulty: "Fácil",
  },
  {
    question: "lim x→3 (2x + 1)",
    options: ["5", "6", "7", "8"],
    answer: "7",
    explanation: "Sustituyendo x=3: 2(3)+1 = 7.",
    difficulty: "Fácil",
  },
  {
    question: "d/dx (5x)",
    options: ["5", "x", "1", "5x"],
    answer: "5",
    explanation: "La derivada de ax es a.",
    difficulty: "Fácil",
  },
  {
    question: "lim x→2 (x²)",
    options: ["2", "4", "8", "1"],
    answer: "4",
    explanation: "Sustituyendo x=2: 2² = 4.",
    difficulty: "Fácil",
  },
  {
    question: "d/dx (3x³)",
    options: ["9x²", "3x²", "6x", "9x"],
    answer: "9x²",
    explanation: "3·3x² = 9x².",
    difficulty: "Media",
  },
  {
    question: "lim x→∞ (1/x)",
    options: ["1", "∞", "0", "-1"],
    answer: "0",
    explanation: "Cuando x crece mucho, 1/x tiende a 0.",
    difficulty: "Media",
  },
  {
    question: "d/dx (7)",
    options: ["7", "1", "0", "x"],
    answer: "0",
    explanation: "La derivada de una constante es 0.",
    difficulty: "Fácil",
  },
  {
    question: "lim x→1 (x+4)",
    options: ["4", "5", "1", "3"],
    answer: "5",
    explanation: "Sustituyendo x=1: 1+4 = 5.",
    difficulty: "Fácil",
  },
  {
    question: "lim x→2 (x²-4)/(x-2)",
    options: ["2", "4", "6", "8"],
    answer: "4",
    explanation: "Se factoriza y queda x+2; evaluando en 2 da 4.",
    difficulty: "Media",
  },
  {
    question: "d/dx (4x³)",
    options: ["12x²", "8x", "4x²", "12x"],
    answer: "12x²",
    explanation: "4·3x² = 12x².",
    difficulty: "Media",
  },
  {
    question: "d/dx (2x⁵)",
    options: ["10x⁴", "8x⁴", "5x⁴", "2x⁴"],
    answer: "10x⁴",
    explanation: "2·5x⁴ = 10x⁴.",
    difficulty: "Media",
  },
  {
    question: "lim x→∞ (2x²+1)/(x²)",
    options: ["2", "1", "0", "∞"],
    answer: "2",
    explanation: "Se divide por x² y queda 2 + 1/x².",
    difficulty: "Media",
  },
];

function shuffleArray(arr) {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function createRaceSession() {
  return shuffleArray(QUESTION_BANK).slice(0, 10);
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

export default function MathRaceGame() {
  const navigate = useNavigate();

  const [questions, setQuestions] = useState(() => createRaceSession());
  const [questionIndex, setQuestionIndex] = useState(0);
  const [playerProgress, setPlayerProgress] = useState(0);
  const [rivalProgress, setRivalProgress] = useState(0);
  const [message, setMessage] = useState("Responde rápido y llega primero a la meta.");
  const [finished, setFinished] = useState(false);
  const [lost, setLost] = useState(false);
  const [timeLeft, setTimeLeft] = useState(50);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [streak, setStreak] = useState(0);

  const current = questions[questionIndex];
  const finishLine = 100;

  useEffect(() => {
    if (finished || lost || !current) return;

    const timer = setTimeout(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setLost(true);
          setMessage("⏰ Se acabó el tiempo. El rival ganó la carrera.");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearTimeout(timer);
  }, [timeLeft, finished, lost, current]);

  function restartRace() {
    setQuestions(createRaceSession());
    setQuestionIndex(0);
    setPlayerProgress(0);
    setRivalProgress(0);
    setMessage("Responde rápido y llega primero a la meta.");
    setFinished(false);
    setLost(false);
    setTimeLeft(50);
    setCorrectAnswers(0);
    setStreak(0);
  }

  function nextQuestion() {
    setQuestionIndex((prev) => {
      const next = prev + 1;
      return next >= questions.length ? 0 : next;
    });
  }

  function handleCorrect() {
    const speedBonus = timeLeft >= 35 ? 4 : timeLeft >= 20 ? 2 : 0;
    const streakBonus = streak >= 2 ? 4 : 0;
    const move = Math.min(18 + speedBonus + streakBonus, 28);
    const newPlayerProgress = Math.min(playerProgress + move, finishLine);

    setPlayerProgress(newPlayerProgress);
    setCorrectAnswers((prev) => prev + 1);
    setStreak((prev) => prev + 1);
    setMessage(`✅ Correcto. ${current.explanation} +${move}% de avance.`);

    if (newPlayerProgress >= finishLine) {
      setFinished(true);
      setMessage("🏁 ¡Ganaste la carrera matemática!");
      return;
    }

    setTimeout(() => {
      nextQuestion();
    }, 800);
  }

  function handleWrong() {
    const rivalMove = Math.min(14 + (questionIndex >= 5 ? 2 : 0), 20);
    const newRivalProgress = Math.min(rivalProgress + rivalMove, finishLine);

    setRivalProgress(newRivalProgress);
    setStreak(0);
    setMessage(`❌ Incorrecto. ${current.explanation} El rival avanzó ${rivalMove}%.`);

    if (newRivalProgress >= finishLine) {
      setLost(true);
      setMessage("💥 El rival llegó primero a la meta.");
      return;
    }

    setTimeout(() => {
      nextQuestion();
    }, 800);
  }

  function checkAnswer(option) {
    if (!current || finished || lost) return;

    if (option === current.answer) {
      handleCorrect();
    } else {
      handleWrong();
    }
  }

  const timerColor =
    timeLeft > 30 ? "#22c55e" : timeLeft > 15 ? "#f59e0b" : "#ef4444";

  const playerLeft = `calc(${playerProgress}% - 22px)`;
  const rivalLeft = `calc(${rivalProgress}% - 22px)`;

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
            <h1 style={{ margin: 0, fontSize: "36px" }}>🏎️ Carrera Matemática</h1>
            <p style={{ color: "#9fb3d9", marginTop: "8px" }}>
              Gana respondiendo bien antes que tu rival.
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
            <div style={hudLabelStyle}>Tu avance</div>
            <div style={hudValueStyle}>🏎️ {playerProgress}%</div>
          </div>
          <div style={hudCardStyle}>
            <div style={hudLabelStyle}>Rival</div>
            <div style={hudValueStyle}>🚗 {rivalProgress}%</div>
          </div>
          <div style={hudCardStyle}>
            <div style={hudLabelStyle}>Aciertos</div>
            <div style={hudValueStyle}>✅ {correctAnswers}</div>
          </div>
          <div style={hudCardStyle}>
            <div style={hudLabelStyle}>Racha</div>
            <div style={hudValueStyle}>🔥 {streak}</div>
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
                  ⏳ Tiempo restante
                </div>
                <div style={barContainerStyle}>
                  <div
                    style={{
                      ...barFillStyle,
                      width: `${(timeLeft / 50) * 100}%`,
                      background:
                        timeLeft > 30
                          ? "linear-gradient(90deg,#22c55e,#3b82f6)"
                          : timeLeft > 15
                          ? "linear-gradient(90deg,#f59e0b,#f97316)"
                          : "linear-gradient(90deg,#ef4444,#dc2626)",
                    }}
                  />
                </div>
                <div
                  style={{
                    marginTop: "8px",
                    textAlign: "right",
                    fontWeight: "800",
                    color: timerColor,
                  }}
                >
                  {timeLeft}s
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
                  <span>🏁 Meta</span>
                  <span>📘 Dificultad: {current?.difficulty || "—"}</span>
                </div>

                <div
                  style={{
                    position: "relative",
                    height: "150px",
                    background:
                      "repeating-linear-gradient(90deg, rgba(255,255,255,0.06) 0 40px, rgba(255,255,255,0.02) 40px 80px)",
                    borderRadius: "16px",
                    overflow: "hidden",
                    border: "1px solid rgba(255,255,255,0.08)",
                  }}
                >
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      background:
                        "repeating-linear-gradient(180deg, transparent 0 72px, rgba(255,255,255,0.18) 72px 75px, transparent 75px 150px)",
                    }}
                  />

                  <div
                    style={{
                      position: "absolute",
                      right: "18px",
                      top: "18px",
                      fontSize: "28px",
                    }}
                  >
                    🏁
                  </div>

                  <div
                    style={{
                      position: "absolute",
                      right: "18px",
                      bottom: "18px",
                      fontSize: "28px",
                    }}
                  >
                    🏁
                  </div>

                  <div
                    style={{
                      position: "absolute",
                      left: playerLeft,
                      top: "18px",
                      fontSize: "48px",
                      transition: "left 0.5s ease",
                      transform: "scaleX(-1)",
                    }}
                  >
                    🏎️
                  </div>

                  <div
                    style={{
                      position: "absolute",
                      left: rivalLeft,
                      bottom: "18px",
                      fontSize: "48px",
                      transition: "left 0.5s ease",
                      transform: "scaleX(-1)",
                    }}
                  >
                    🚗
                  </div>

                  <div
                    style={{
                      position: "absolute",
                      left: "12px",
                      top: "26px",
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
                      left: "12px",
                      bottom: "26px",
                      fontSize: "14px",
                      color: "#fca5a5",
                      fontWeight: "800",
                    }}
                  >
                    Rival
                  </div>
                </div>
              </div>
            </div>

            <div style={{ ...panelStyle, marginTop: "14px", fontSize: "15px" }}>
              {message}
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
                onClick={restartRace}
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