import { useState } from "react";
import { useNavigate } from "react-router-dom";

const QUESTION_BANK = {
  attack: [
    {
      question: "d/dx (x²)",
      options: ["2x", "x", "x²", "2"],
      answer: "2x",
      explanation: "La derivada de x² es 2x.",
    },
    {
      question: "d/dx (5x)",
      options: ["5", "x", "1", "5x"],
      answer: "5",
      explanation: "La derivada de 5x es 5.",
    },
    {
      question: "d/dx (3x³)",
      options: ["9x²", "3x²", "6x", "9x"],
      answer: "9x²",
      explanation: "3·3x² = 9x².",
    },
    {
      question: "d/dx (4x³)",
      options: ["12x²", "8x", "4x²", "12x"],
      answer: "12x²",
      explanation: "4·3x² = 12x².",
    },
    {
      question: "d/dx (6x²)",
      options: ["12x", "6x", "8x", "10x"],
      answer: "12x",
      explanation: "6·2x = 12x.",
    },
    {
      question: "d/dx (2x⁴)",
      options: ["8x³", "6x³", "4x³", "2x³"],
      answer: "8x³",
      explanation: "2·4x³ = 8x³.",
    },
  ],
  defend: [
    {
      question: "lim x→2 (x²)",
      options: ["2", "4", "8", "1"],
      answer: "4",
      explanation: "Sustituyendo x=2: 2² = 4.",
    },
    {
      question: "d/dx (7)",
      options: ["7", "1", "0", "x"],
      answer: "0",
      explanation: "La derivada de una constante es 0.",
    },
    {
      question: "lim x→1 (x+4)",
      options: ["4", "5", "1", "3"],
      answer: "5",
      explanation: "Sustituyendo x=1: 1+4 = 5.",
    },
    {
      question: "lim x→0 (x+2)",
      options: ["0", "1", "2", "3"],
      answer: "2",
      explanation: "Sustituyendo x=0: 0+2 = 2.",
    },
    {
      question: "d/dx (9)",
      options: ["9", "0", "1", "x"],
      answer: "0",
      explanation: "La derivada de una constante es 0.",
    },
    {
      question: "lim x→3 (x-1)",
      options: ["1", "2", "3", "4"],
      answer: "2",
      explanation: "Sustituyendo x=3: 3-1 = 2.",
    },
  ],
  heal: [
    {
      question: "d/dx (3x)",
      options: ["3", "x", "1", "0"],
      answer: "3",
      explanation: "La derivada de 3x es 3.",
    },
    {
      question: "lim x→0 (x+2)",
      options: ["0", "1", "2", "3"],
      answer: "2",
      explanation: "Sustituyendo x=0: 0+2 = 2.",
    },
    {
      question: "d/dx (9)",
      options: ["9", "0", "1", "x"],
      answer: "0",
      explanation: "La derivada de una constante es 0.",
    },
    {
      question: "lim x→2 (x+1)",
      options: ["1", "2", "3", "4"],
      answer: "3",
      explanation: "Sustituyendo x=2: 2+1 = 3.",
    },
    {
      question: "d/dx (8x)",
      options: ["8", "1", "0", "8x"],
      answer: "8",
      explanation: "La derivada de 8x es 8.",
    },
    {
      question: "lim x→1 (2x)",
      options: ["1", "2", "3", "0"],
      answer: "2",
      explanation: "Sustituyendo x=1: 2·1 = 2.",
    },
  ],
  special: [
    {
      question: "d/dx (4x³)",
      options: ["12x²", "8x", "4x²", "12x"],
      answer: "12x²",
      explanation: "4·3x² = 12x².",
    },
    {
      question: "lim x→2 (x²-4)/(x-2)",
      options: ["2", "4", "6", "8"],
      answer: "4",
      explanation: "Se factoriza y queda x+2; evaluando en 2 da 4.",
    },
    {
      question: "lim x→∞ (1/x)",
      options: ["1", "∞", "0", "-1"],
      answer: "0",
      explanation: "Cuando x crece mucho, 1/x tiende a 0.",
    },
    {
      question: "lim x→∞ (2x²+1)/(x²)",
      options: ["2", "1", "0", "∞"],
      answer: "2",
      explanation: "Se divide por x² y queda 2 + 1/x².",
    },
    {
      question: "d/dx (2x⁵)",
      options: ["10x⁴", "8x⁴", "5x⁴", "2x⁴"],
      answer: "10x⁴",
      explanation: "2·5x⁴ = 10x⁴.",
    },
    {
      question: "lim x→9 (√x-3)/(x-9)",
      options: ["1/6", "1/3", "1/9", "3"],
      answer: "1/6",
      explanation: "Se racionaliza con el conjugado.",
    },
  ],
};

function randomFrom(list) {
  return list[Math.floor(Math.random() * list.length)];
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

const arenaStyle = {
  background: "rgba(34,51,102,0.55)",
  borderRadius: "18px",
  padding: "18px",
  display: "grid",
  gridTemplateColumns: "1fr auto 1fr",
  alignItems: "center",
};

const barTitlePlayer = {
  marginBottom: "8px",
  fontWeight: "800",
  color: "#bfdbfe",
  fontSize: "14px",
};

const barTitleEnemy = {
  marginBottom: "8px",
  fontWeight: "800",
  color: "#fca5a5",
  fontSize: "14px",
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
  transition: "width 0.3s ease",
};

export default function MathBattleGame() {
  const navigate = useNavigate();

  const [playerLife, setPlayerLife] = useState(100);
  const [enemyLife, setEnemyLife] = useState(100);
  const [message, setMessage] = useState(
    "Elige tu acción para comenzar la batalla."
  );
  const [finished, setFinished] = useState(false);
  const [lost, setLost] = useState(false);
  const [selectedAction, setSelectedAction] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [shieldActive, setShieldActive] = useState(false);
  const [turnCount, setTurnCount] = useState(1);

  const actionConfig = {
    attack: {
      label: "⚔️ Atacar",
      description: "Golpe normal si aciertas.",
      damage: 18,
      buttonColor: "linear-gradient(135deg, #2563eb, #3b82f6)",
    },
    defend: {
      label: "🛡️ Defender",
      description: "Reduce el próximo daño enemigo.",
      buttonColor: "linear-gradient(135deg, #0f766e, #14b8a6)",
    },
    heal: {
      label: "❤️ Curar",
      description: "Recupera vida si aciertas.",
      heal: 16,
      buttonColor: "linear-gradient(135deg, #dc2626, #ef4444)",
    },
    special: {
      label: "💥 Poder especial",
      description: "Mucho daño, pero pregunta más difícil.",
      damage: 30,
      buttonColor: "linear-gradient(135deg, #7c3aed, #a855f7)",
    },
  };

  function restartBattle() {
    setPlayerLife(100);
    setEnemyLife(100);
    setMessage("Elige tu acción para comenzar la batalla.");
    setFinished(false);
    setLost(false);
    setSelectedAction(null);
    setCurrentQuestion(null);
    setShieldActive(false);
    setTurnCount(1);
  }

  function startAction(actionKey) {
    const question = randomFrom(QUESTION_BANK[actionKey]);
    setSelectedAction(actionKey);
    setCurrentQuestion(question);
    setMessage(`Has elegido ${actionConfig[actionKey].label}.`);
  }

  function enemyTurn() {
    let damage = turnCount >= 5 ? 16 : 12;

    if (shieldActive) {
      damage = Math.max(damage - 8, 3);
    }

    setShieldActive(false);

    setPlayerLife((prev) => {
      const next = Math.max(prev - damage, 0);

      if (next <= 0) {
        setLost(true);
        setMessage(`💀 El enemigo te derrotó con ${damage} de daño.`);
      } else {
        setMessage(`👹 El enemigo atacó con ${damage} de daño.`);
      }

      return next;
    });

    setTurnCount((prev) => prev + 1);
  }

  function resolveCorrectAnswer() {
    const action = actionConfig[selectedAction];

    if (selectedAction === "attack" || selectedAction === "special") {
      const damage = action.damage;

      setEnemyLife((prev) => {
        const next = Math.max(prev - damage, 0);

        if (next <= 0) {
          setFinished(true);
          setMessage("🏆 ¡Victoria! Derrotaste al enemigo.");
        } else {
          setMessage(`✅ Golpe exitoso: ${damage} de daño.`);
        }

        return next;
      });
    }

    if (selectedAction === "defend") {
      setShieldActive(true);
      setMessage("🛡️ Defensa activada.");
    }

    if (selectedAction === "heal") {
      setPlayerLife((prev) => Math.min(prev + action.heal, 100));
      setMessage(`❤️ Recuperaste ${action.heal} de vida.`);
    }

    setSelectedAction(null);
    setCurrentQuestion(null);

    setTimeout(() => {
      if (!finished && !lost) {
        enemyTurn();
      }
    }, 700);
  }

  function resolveWrongAnswer() {
    setMessage("❌ Respuesta incorrecta. Perdiste el turno.");
    setSelectedAction(null);
    setCurrentQuestion(null);

    setTimeout(() => {
      if (!finished && !lost) {
        enemyTurn();
      }
    }, 700);
  }

  function checkAnswer(option) {
    if (!currentQuestion) return;

    if (option === currentQuestion.answer) {
      resolveCorrectAnswer();
    } else {
      resolveWrongAnswer();
    }
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at top, #0f1b3d 0%, #081226 55%, #050b18 100%)",
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
            <h1 style={{ margin: 0, fontSize: "36px" }}>⚔️ Batalla Matemática</h1>
            <p style={{ color: "#9fb3d9", marginTop: "8px" }}>
              Elige bien tu acción y derrota al enemigo.
            </p>
          </div>

          <div style={{ width: "150px" }} />
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
            gap: "14px",
            marginBottom: "18px",
          }}
        >
          <div style={hudCardStyle}>
            <div style={hudLabelStyle}>Tu vida</div>
            <div style={hudValueStyle}>🛡️ {playerLife}</div>
          </div>
          <div style={hudCardStyle}>
            <div style={hudLabelStyle}>Vida enemigo</div>
            <div style={hudValueStyle}>👹 {enemyLife}</div>
          </div>
          <div style={hudCardStyle}>
            <div style={hudLabelStyle}>Turno</div>
            <div style={hudValueStyle}>🎯 {turnCount}</div>
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
                <div style={barTitlePlayer}>Tu vida</div>
                <div style={barContainerStyle}>
                  <div
                    style={{
                      ...barFillStyle,
                      width: `${playerLife}%`,
                      background: "linear-gradient(90deg,#22c55e,#3b82f6)",
                    }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: "18px" }}>
                <div style={barTitleEnemy}>Vida enemigo</div>
                <div style={barContainerStyle}>
                  <div
                    style={{
                      ...barFillStyle,
                      width: `${enemyLife}%`,
                      background: "linear-gradient(90deg,#ef4444,#f97316)",
                    }}
                  />
                </div>
              </div>

              <div style={arenaStyle}>
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: "64px" }}>🧙</div>
                  <div style={{ color: "#bfdbfe", fontWeight: "800" }}>Tú</div>
                </div>

                <div style={{ fontSize: "28px" }}>⚡</div>

                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: "64px" }}>👹</div>
                  <div style={{ color: "#fca5a5", fontWeight: "800" }}>
                    Enemigo
                  </div>
                </div>
              </div>
            </div>

            <div style={{ ...panelStyle, marginTop: "14px", fontSize: "15px" }}>
              {message}
            </div>
          </div>

          <div>
            {!currentQuestion && !finished && !lost && (
              <div style={{ display: "grid", gap: "12px" }}>
                {Object.entries(actionConfig).map(([key, action]) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => startAction(key)}
                    style={{
                      padding: "16px",
                      borderRadius: "16px",
                      border: "none",
                      background: action.buttonColor,
                      color: "white",
                      textAlign: "left",
                      cursor: "pointer",
                    }}
                  >
                    <div style={{ fontWeight: "900", fontSize: "18px" }}>
                      {action.label}
                    </div>
                    <div style={{ marginTop: "4px", fontSize: "14px" }}>
                      {action.description}
                    </div>
                  </button>
                ))}
              </div>
            )}

            {currentQuestion && !finished && !lost && (
              <div style={panelStyle}>
                <div
                  style={{
                    fontSize: "22px",
                    textAlign: "center",
                    marginBottom: "18px",
                  }}
                >
                  {currentQuestion.question}
                </div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "12px",
                  }}
                >
                  {currentQuestion.options.map((option) => (
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
                onClick={restartBattle}
                style={{
                  marginTop: "14px",
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