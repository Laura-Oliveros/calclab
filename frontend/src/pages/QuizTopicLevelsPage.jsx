import { Link, useParams } from "react-router-dom";

export default function QuizTopicLevelsPage() {
  const { topic } = useParams();

  const topicLabel =
    topic === "derivatives"
      ? "📘 Quiz de Derivadas"
      : topic === "limits"
      ? "📗 Quiz de Límites"
      : "🧠 Quiz";

  const containerStyle = {
    minHeight: "100vh",
    padding: "50px 40px",
    background: "linear-gradient(135deg, #0f172a, #1e293b)",
    color: "white",
  };

  const backStyle = {
    display: "inline-block",
    marginBottom: "18px",
    padding: "10px 16px",
    borderRadius: "12px",
    border: "1px solid rgba(255,255,255,0.10)",
    background: "rgba(255,255,255,0.06)",
    color: "white",
    fontWeight: "700",
    textDecoration: "none",
  };

  const gridStyle = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "20px",
    marginTop: "30px",
  };

  const cardStyle = {
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "20px",
    padding: "24px",
    textDecoration: "none",
    color: "white",
    display: "block",
    boxShadow: "0 8px 20px rgba(0,0,0,0.25)",
  };

  const titleStyle = {
    fontSize: "24px",
    marginBottom: "10px",
  };

  const textStyle = {
    color: "#cbd5e1",
    lineHeight: "1.6",
    fontSize: "15px",
  };

  return (
    <div style={containerStyle}>
      <Link to="/quiz" style={backStyle}>
        ← Volver al menú de quiz
      </Link>

      <h1 style={{ fontSize: "42px", marginBottom: "10px" }}>{topicLabel}</h1>

      <p style={{ color: "#cbd5e1", fontSize: "18px", maxWidth: "780px" }}>
        Selecciona el nivel que quieres practicar.
      </p>

      <div style={gridStyle}>
        <Link to={`/quiz/${topic}/facil`} style={cardStyle}>
          <h2 style={titleStyle}>🟢 Fácil</h2>
          <p style={textStyle}>Preguntas introductorias para comenzar.</p>
        </Link>

        <Link to={`/quiz/${topic}/intermedio`} style={cardStyle}>
          <h2 style={titleStyle}>🟡 Intermedio</h2>
          <p style={textStyle}>Ejercicios de análisis medio y más práctica.</p>
        </Link>

        <Link to={`/quiz/${topic}/dificil`} style={cardStyle}>
          <h2 style={titleStyle}>🔴 Difícil</h2>
          <p style={textStyle}>Preguntas más retadoras y avanzadas.</p>
        </Link>
      </div>
    </div>
  );
}