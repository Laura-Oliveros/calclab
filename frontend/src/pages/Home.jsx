import { Link } from "react-router-dom";

const cards = [
  {
    icon: "📘",
    title: "Derivadas",
    description:
      "Resuelve ejercicios, visualiza resultados y luego practica con mini juegos interactivos.",
    cta: "Entrar",
    to: "/derivatives",
  },
  {
    icon: "📗",
    title: "Límites",
    description:
      "Aprende límites con ejemplos guiados, módulos paso a paso y quizzes por nivel.",
    cta: "Entrar",
    to: "/limits",
  },
  {
    icon: "🎮",
    title: "PlayLab",
    description:
      "Juega, responde rápido y gana puntos para subir en el ranking general.",
    cta: "Jugar",
    to: "/playlab",
  },
  {
    icon: "🏆",
    title: "Ranking",
    description:
      "Consulta quién tiene el mejor puntaje y compite por entrar al top.",
    cta: "Ver ranking",
    to: "/ranking",
  },
  {
    icon: "🧠",
    title: "Quiz",
    description:
      "Practica límites y derivadas por niveles con preguntas tipo quiz.",
    cta: "Entrar",
    to: "/quiz",
  },
];

export default function Home() {
  const isMobile = typeof window !== "undefined" && window.innerWidth <= 768;
  const isTablet = typeof window !== "undefined" && window.innerWidth <= 1024;

  return (
    <div
      style={{
        minHeight: "100vh",
        color: "white",
        background:
          "radial-gradient(circle at top left, rgba(59,130,246,0.18), transparent 35%), radial-gradient(circle at top right, rgba(124,58,237,0.18), transparent 35%), linear-gradient(135deg, #0b1120, #0f172a 45%, #111827)",
      }}
    >
      <section
        style={{
          maxWidth: "1280px",
          margin: "0 auto",
          padding: isMobile ? "36px 18px 32px" : "72px 32px 48px",
        }}
      >
        <p
          style={{
            color: "#60a5fa",
            fontWeight: 800,
            letterSpacing: "0.08em",
            marginBottom: "16px",
            fontSize: isMobile ? "12px" : "14px",
            textAlign: isMobile ? "center" : "left",
          }}
        >
          PLATAFORMA INTERACTIVA DE CÁLCULO
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: isTablet ? "1fr" : "1.4fr 0.9fr",
            gap: isMobile ? "28px" : "28px",
            alignItems: "center",
          }}
        >
          <div style={{ textAlign: isMobile ? "center" : "left" }}>
            <h1
              style={{
                fontSize: isMobile ? "40px" : "clamp(44px, 6vw, 72px)",
                lineHeight: isMobile ? 1.08 : 1.02,
                marginBottom: "22px",
                fontWeight: 900,
              }}
            >
              Aprende cálculo de forma visual,
              <br />
              dinámica y competitiva.
            </h1>

            <p
              style={{
                fontSize: isMobile ? "17px" : "22px",
                color: "#cbd5e1",
                lineHeight: 1.6,
                maxWidth: isMobile ? "100%" : "760px",
                marginBottom: "28px",
                marginInline: isMobile ? "auto" : "0",
              }}
            >
              Domina derivadas y límites con resolución paso a paso, quizzes por
              dificultad, mini juegos y ranking en tiempo real.
            </p>

            <div
              style={{
                display: "flex",
                gap: "14px",
                flexWrap: "wrap",
                flexDirection: isMobile ? "column" : "row",
                alignItems: "center",
                justifyContent: isMobile ? "center" : "flex-start",
              }}
            >
              <Link
                to="/derivatives"
                style={{
                  ...primaryBtn,
                  width: isMobile ? "100%" : "fit-content",
                  maxWidth: isMobile ? "320px" : "unset",
                  textAlign: "center",
                  boxSizing: "border-box",
                }}
              >
                🚀 Ir a Derivadas
              </Link>
              <Link
                to="/limits"
                style={{
                  ...secondaryBtn,
                  width: isMobile ? "100%" : "fit-content",
                  maxWidth: isMobile ? "320px" : "unset",
                  textAlign: "center",
                  boxSizing: "border-box",
                }}
              >
                📗 Ir a Límites
              </Link>
            </div>
          </div>

          <div
            style={{
              position: "relative",
              minHeight: isMobile ? "unset" : "320px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                width: "100%",
                maxWidth: isMobile ? "100%" : "420px",
                background:
                  "linear-gradient(135deg, rgba(37,99,235,0.18), rgba(124,58,237,0.18))",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: isMobile ? "22px" : "28px",
                padding: isMobile ? "20px" : "26px",
                boxShadow: "0 25px 80px rgba(0,0,0,0.28)",
                backdropFilter: "blur(10px)",
              }}
            >
              <div
                style={{
                  fontSize: isMobile ? "16px" : "18px",
                  color: "#93c5fd",
                  fontWeight: 800,
                  marginBottom: "18px",
                }}
              >
                ✨ Experiencia inmersiva
              </div>

              <div
                style={{
                  display: "grid",
                  gap: "14px",
                }}
              >
                <div style={previewCard}>📘 Derivadas paso a paso</div>
                <div style={previewCard}>📗 Límites con ejemplos visuales</div>
                <div style={previewCard}>🧠 Quiz por niveles</div>
                <div style={previewCard}>🏆 Ranking en vivo</div>
                <div style={previewCard}>🎮 PlayZone y retos rápidos</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        style={{
          maxWidth: "1280px",
          margin: "0 auto",
          padding: isMobile ? "0 18px 48px" : "0 32px 64px",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: isMobile
              ? "1fr"
              : "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "22px",
          }}
        >
          {cards.map((card) => (
            <Link
              key={card.title}
              to={card.to}
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <div style={featureCard}>
                <div style={{ fontSize: "34px", marginBottom: "12px" }}>
                  {card.icon}
                </div>
                <h3
                  style={{
                    fontSize: isMobile ? "24px" : "30px",
                    marginBottom: "14px",
                  }}
                >
                  {card.title}
                </h3>
                <p
                  style={{
                    color: "#cbd5e1",
                    lineHeight: 1.7,
                    minHeight: isMobile ? "unset" : "88px",
                    fontSize: isMobile ? "15px" : "16px",
                  }}
                >
                  {card.description}
                </p>
                <div style={cardBtn}>{card.cta}</div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}

const primaryBtn = {
  textDecoration: "none",
  color: "white",
  fontWeight: 800,
  padding: "14px 22px",
  borderRadius: "14px",
  background: "linear-gradient(135deg, #2563eb, #7c3aed)",
  boxShadow: "0 10px 30px rgba(59,130,246,0.25)",
};

const secondaryBtn = {
  textDecoration: "none",
  color: "white",
  fontWeight: 800,
  padding: "14px 22px",
  borderRadius: "14px",
  border: "1px solid rgba(255,255,255,0.14)",
  background: "rgba(255,255,255,0.04)",
};

const previewCard = {
  background: "rgba(255,255,255,0.05)",
  border: "1px solid rgba(255,255,255,0.06)",
  borderRadius: "18px",
  padding: "16px 18px",
  fontWeight: 700,
  color: "white",
};

const featureCard = {
  background: "rgba(255,255,255,0.05)",
  border: "1px solid rgba(255,255,255,0.08)",
  borderRadius: "24px",
  padding: "24px",
  backdropFilter: "blur(8px)",
  boxShadow: "0 14px 40px rgba(0,0,0,0.18)",
  transition: "all 0.25s ease",
  height: "100%",
  boxSizing: "border-box",
};

const cardBtn = {
  marginTop: "18px",
  display: "inline-block",
  padding: "12px 18px",
  borderRadius: "12px",
  background: "linear-gradient(135deg, #2563eb, #7c3aed)",
  fontWeight: 800,
  width: "fit-content",
};