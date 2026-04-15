import { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../api/client";

const QUESTION_BANK = {
  derivatives: {
    facil: [
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
        question: "d/dx (7)",
        options: ["7", "1", "0", "x"],
        answer: "0",
        explanation: "La derivada de una constante es 0.",
      },
      {
        question: "d/dx (3x)",
        options: ["3", "x", "1", "0"],
        answer: "3",
        explanation: "La derivada de 3x es 3.",
      },
    ],
    intermedio: [
      {
        question: "d/dx (4x³)",
        options: ["12x²", "8x", "4x²", "12x"],
        answer: "12x²",
        explanation: "4·3x² = 12x².",
      },
      {
        question: "d/dx (3x²+2x)",
        options: ["6x+2", "5x", "6x", "2x+2"],
        answer: "6x+2",
        explanation: "La derivada de 3x² es 6x y la de 2x es 2.",
      },
      {
        question: "d/dx (2x⁵)",
        options: ["10x⁴", "8x⁴", "5x⁴", "2x⁴"],
        answer: "10x⁴",
        explanation: "2·5x⁴ = 10x⁴.",
      },
      {
        question: "d/dx (6x²)",
        options: ["12x", "6x", "8x", "10x"],
        answer: "12x",
        explanation: "6·2x = 12x.",
      },
    ],
    dificil: [
      {
        question: "d/dx ((x²)(x+1))",
        options: ["3x²+2x", "2x+1", "x²+1", "3x²"],
        answer: "3x²+2x",
        explanation: "Aplicando producto: (2x)(x+1)+x²(1)=3x²+2x.",
      },
      {
        question: "d/dx (x⁴-3x²+2x)",
        options: ["4x³-6x+2", "4x²-6x+2", "x³-6x+2", "4x³-3x+2"],
        answer: "4x³-6x+2",
        explanation: "Se deriva término a término.",
      },
      {
        question: "d/dx (5x³-2x+7)",
        options: ["15x²-2", "15x²+2", "5x²-2", "15x-2"],
        answer: "15x²-2",
        explanation: "La derivada de 5x³ es 15x² y la de -2x es -2.",
      },
      {
        question: "d/dx ((x+1)(x+2))",
        options: ["2x+3", "x+3", "2x+2", "x²+3x+2"],
        answer: "2x+3",
        explanation: "Producto: (x+2)+(x+1)=2x+3.",
      },
    ],
  },

  limits: {
    facil: [
      {
        question: "lim x→2 (x+3)",
        options: ["3", "4", "5", "6"],
        answer: "5",
        explanation: "Sustituyendo x=2: 2+3 = 5.",
      },
      {
        question: "lim x→1 (x²)",
        options: ["1", "2", "0", "3"],
        answer: "1",
        explanation: "Sustituyendo x=1: 1² = 1.",
      },
      {
        question: "lim x→3 (2x+1)",
        options: ["5", "6", "7", "8"],
        answer: "7",
        explanation: "Sustituyendo x=3: 2(3)+1 = 7.",
      },
      {
        question: "lim x→0 (x+2)",
        options: ["0", "1", "2", "3"],
        answer: "2",
        explanation: "Sustituyendo x=0: 0+2 = 2.",
      },
    ],
    intermedio: [
      {
        question: "lim x→2 (x²-4)/(x-2)",
        options: ["2", "4", "6", "8"],
        answer: "4",
        explanation: "Se factoriza y queda x+2; evaluando en 2 da 4.",
      },
      {
        question: "lim x→3 (x²-9)/(x-3)",
        options: ["3", "6", "9", "12"],
        answer: "6",
        explanation: "Se factoriza como (x-3)(x+3).",
      },
      {
        question: "lim x→-1 (x²+3x+2)/(x+1)",
        options: ["1", "2", "3", "4"],
        answer: "1",
        explanation: "Se factoriza y queda x+2; evaluando en -1 da 1.",
      },
      {
        question: "lim x→1 (x²-1)/(x-1)",
        options: ["1", "2", "3", "0"],
        answer: "2",
        explanation: "Se factoriza como (x-1)(x+1).",
      },
    ],
    dificil: [
      {
        question: "lim x→9 (√x-3)/(x-9)",
        options: ["1/6", "1/3", "1/9", "3"],
        answer: "1/6",
        explanation: "Se racionaliza con el conjugado.",
      },
      {
        question: "lim x→∞ (2x²+1)/(x²)",
        options: ["2", "1", "0", "∞"],
        answer: "2",
        explanation: "Se divide por x² y queda 2 + 1/x².",
      },
      {
        question: "lim x→∞ (1/x)",
        options: ["1", "∞", "0", "-1"],
        answer: "0",
        explanation: "Cuando x crece mucho, 1/x tiende a 0.",
      },
      {
        question: "lim x→4 (√x-2)/(x-4)",
        options: ["1/4", "1/2", "2", "4"],
        answer: "1/4",
        explanation: "Se racionaliza y queda 1/(√x+2).",
      },
    ],
  },
};

function shuffleArray(arr) {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export default function QuizPage() {
  const { topic, level } = useParams();

  const normalizedTopic = ["derivatives", "limits"].includes(topic)
    ? topic
    : "derivatives";

  const normalizedLevel = ["facil", "intermedio", "dificil"].includes(level)
    ? level
    : "facil";

  const questions = useMemo(
    () => shuffleArray(QUESTION_BANK[normalizedTopic][normalizedLevel]).slice(0, 4),
    [normalizedTopic, normalizedLevel]
  );

  const [questionIndex, setQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [locked, setLocked] = useState(false);
  const [scoreSaved, setScoreSaved] = useState(false);

  const current = questions[questionIndex];

  async function saveQuizScore(finalScore) {
    const token = localStorage.getItem("token");
    if (!token || scoreSaved) return;

    const multiplier =
      normalizedLevel === "facil"
        ? 10
        : normalizedLevel === "intermedio"
        ? 20
        : 30;

    try {
      await api.post(
        "/ranking",
        {
          gameType: `quiz_${normalizedTopic}_${normalizedLevel}`,
          score: finalScore * multiplier,
          correctAnswers: finalScore,
          totalQuestions: questions.length,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setScoreSaved(true);
    } catch (error) {
      console.error("Error guardando puntaje:", error);
    }
  }

  function handleAnswer(option) {
    if (finished || locked || !current) return;

    setLocked(true);

    let nextScore = score;

    if (option === current.answer) {
      nextScore = score + 1;
      setScore(nextScore);
    }

    setTimeout(() => {
      if (questionIndex + 1 >= questions.length) {
        setFinished(true);
        setLocked(false);
        saveQuizScore(nextScore);
      } else {
        setQuestionIndex((prev) => prev + 1);
        setLocked(false);
      }
    }, 700);
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        padding: "40px",
        background: "linear-gradient(135deg, #0f172a, #1e293b)",
        color: "white",
      }}
    >
      <div style={{ maxWidth: "900px", margin: "0 auto" }}>
        <Link
          to={`/quiz/${normalizedTopic}`}
          style={{
            display: "inline-block",
            marginBottom: "20px",
            color: "#93c5fd",
            fontWeight: "700",
            textDecoration: "none",
          }}
        >
          ← Volver a niveles
        </Link>

        {!finished && current && (
          <div
            style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: "20px",
              padding: "24px",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "18px",
                color: "#93c5fd",
                fontWeight: "700",
              }}
            >
              <span>
                Pregunta {questionIndex + 1} / {questions.length}
              </span>
              <span>Puntaje: {score}</span>
            </div>

            <h2 style={{ fontSize: "34px", marginBottom: "24px" }}>
              {current.question}
            </h2>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "16px",
              }}
            >
              {current.options.map((option) => (
                <button
                  key={option}
                  onClick={() => handleAnswer(option)}
                  disabled={locked}
                  style={{
                    padding: "18px",
                    borderRadius: "14px",
                    border: "none",
                    background: "linear-gradient(135deg, #2563eb, #7c3aed)",
                    color: "white",
                    fontWeight: "700",
                    cursor: "pointer",
                    fontSize: "18px",
                  }}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        )}

        {finished && (
          <div
            style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: "20px",
              padding: "24px",
            }}
          >
            <h2 style={{ fontSize: "32px", marginBottom: "16px" }}>
              🎉 Resultado final
            </h2>

            <p style={{ fontSize: "22px", marginBottom: "12px" }}>
              Obtuviste {score} de {questions.length} respuestas correctas
            </p>

            <p style={{ color: "#93c5fd", fontSize: "18px" }}>
              {score === 4
                ? "🔥 Excelente, puntaje perfecto"
                : score === 3
                ? "👏 Muy bien, casi perfecto"
                : score === 2
                ? "👍 Bien, pero puedes mejorar"
                : "📚 Sigue practicando, tú puedes"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}