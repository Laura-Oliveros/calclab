import { Link } from "react-router-dom";

export default function PlayLabMenu() {
  const games = [
    {
      emoji: "🔒",
      title: "Escape Matemático",
      desc: "Escapa resolviendo límites y derivadas paso a paso.",
      route: "/playlab/escape",
      available: true,
    },
    {
      emoji: "🧩",
      title: "Puzzle de Pasos",
      desc: "Ordena correctamente los pasos de resolución.",
      route: "/playlab/puzzle",
      available: true,
    },
    {
      emoji: "🏎️",
      title: "Carrera Matemática",
      desc: "Resuelve rápido y gana velocidad.",
      route: "/playlab/race",
      available: true,
    },
    {
      emoji: "⚔️",
      title: "Batalla Matemática",
      desc: "Combate enemigos resolviendo ejercicios.",
      route: "/playlab/battle",
      available: true,
    },
  ];

  return (
    <div
      style={{
        minHeight: "100vh",
        padding: "60px 40px",
        background: "linear-gradient(135deg, #0f172a, #1e293b)",
        color: "white",
      }}
    >
      <div style={{ textAlign: "center", marginBottom: "40px" }}>
        <h1 style={{ fontSize: "48px", fontWeight: "900" }}>🎮 PlayLab</h1>
        <p style={{ color: "#cbd5e1", fontSize: "18px" }}>
          Mini juegos matemáticos de Calclab.
        </p>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
          gap: "24px",
        }}
      >
        {games.map((game, index) => {
          const cardContent = (
            <>
              <h2 style={{ fontSize: "28px", marginBottom: "10px" }}>
                {game.emoji} {game.title}
              </h2>

              <p style={{ color: "#cbd5e1", lineHeight: "1.7" }}>
                {game.desc}
              </p>

              <button
                style={{
                  marginTop: "18px",
                  background: "linear-gradient(90deg,#3b82f6,#7c3aed)",
                  border: "none",
                  color: "white",
                  padding: "12px 20px",
                  borderRadius: "12px",
                  fontWeight: "700",
                  cursor: game.available ? "pointer" : "default",
                }}
              >
                {game.available ? "Jugar ahora" : "Próximamente"}
              </button>
            </>
          );

          const cardStyle = {
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: "24px",
            padding: "28px",
            textDecoration: "none",
            color: "white",
            display: "block",
          };

          if (game.available) {
            return (
              <Link key={index} to={game.route} style={cardStyle}>
                {cardContent}
              </Link>
            );
          }

          return (
            <div key={index} style={cardStyle}>
              {cardContent}
            </div>
          );
        })}
      </div>
    </div>
  );
}