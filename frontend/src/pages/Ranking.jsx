import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/client";

export default function Ranking() {
  const [scores, setScores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const username = localStorage.getItem("username") || "Usuario";

  useEffect(() => {
    loadRanking();
  }, []);

  async function loadRanking() {
    setLoading(true);
    setError("");

    try {
      const res = await api.get("/ranking/top");
      setScores(res.data.scores || []);
    } catch (err) {
      console.error(err);
      setError("No se pudo cargar el ranking.");
    } finally {
      setLoading(false);
    }
  }

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    navigate("/login-ranking");
  }

  const currentUserEntry = useMemo(() => {
    return scores.find(
      (item) => item.username?.toLowerCase() === username.toLowerCase()
    );
  }, [scores, username]);

  const topThree = scores.slice(0, 3);

  return (
    <div
      style={{
        minHeight: "100vh",
        padding: "40px",
        background: "linear-gradient(135deg, #0f172a, #1e293b)",
        color: "white",
      }}
    >
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "16px",
            flexWrap: "wrap",
            marginBottom: "24px",
          }}
        >
          <div>
            <p
              style={{
                color: "#60a5fa",
                fontWeight: "800",
                fontSize: "13px",
                letterSpacing: "1px",
                marginBottom: "8px",
                textTransform: "uppercase",
              }}
            >
              Competencia Calclab
            </p>

            <h1 style={{ fontSize: "46px", margin: 0 }}>🏆 Ranking</h1>

            <p
              style={{
                color: "#cbd5e1",
                marginTop: "10px",
                fontSize: "18px",
                lineHeight: "1.6",
              }}
            >
              Bienvenido, <strong>{username}</strong>. Aquí puedes ver cómo vas
              frente a los demás usuarios.
            </p>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            style={{
              padding: "12px 18px",
              borderRadius: "12px",
              border: "1px solid rgba(255,255,255,0.10)",
              background: "rgba(239,68,68,0.18)",
              color: "white",
              fontWeight: "700",
              cursor: "pointer",
            }}
          >
            Cerrar sesión
          </button>
        </div>

        {currentUserEntry && (
          <div
            style={{
              background: "rgba(37,99,235,0.12)",
              border: "1px solid rgba(96,165,250,0.20)",
              borderRadius: "20px",
              padding: "18px",
              marginBottom: "24px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: "16px",
              flexWrap: "wrap",
            }}
          >
            <div>
              <div
                style={{
                  color: "#93c5fd",
                  fontWeight: "800",
                  fontSize: "13px",
                  marginBottom: "6px",
                  textTransform: "uppercase",
                }}
              >
                Tu posición actual
              </div>
              <div style={{ fontSize: "22px", fontWeight: "800" }}>
                {currentUserEntry.username}
              </div>
            </div>

            <div style={{ fontSize: "18px", fontWeight: "700", color: "#e2e8f0" }}>
              {currentUserEntry.score} pts
            </div>
          </div>
        )}

        {loading && (
          <div
            style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: "18px",
              padding: "20px",
              color: "#cbd5e1",
            }}
          >
            Cargando ranking...
          </div>
        )}

        {error && (
          <div
            style={{
              background: "rgba(239,68,68,0.15)",
              border: "1px solid rgba(239,68,68,0.30)",
              borderRadius: "18px",
              padding: "20px",
              color: "#fecaca",
            }}
          >
            {error}
          </div>
        )}

        {!loading && !error && scores.length > 0 && (
          <>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                gap: "18px",
                marginBottom: "28px",
              }}
            >
              {topThree.map((player, index) => {
                const medals = ["🥇", "🥈", "🥉"];
                return (
                  <div
                    key={player.id || `${player.username}-${index}`}
                    style={{
                      background: "rgba(255,255,255,0.05)",
                      border: "1px solid rgba(255,255,255,0.08)",
                      borderRadius: "22px",
                      padding: "22px",
                      boxShadow: "0 10px 30px rgba(0,0,0,0.22)",
                    }}
                  >
                    <div
                      style={{
                        fontSize: "34px",
                        marginBottom: "12px",
                      }}
                    >
                      {medals[index]}
                    </div>

                    <div
                      style={{
                        color: "#93c5fd",
                        fontWeight: "800",
                        fontSize: "13px",
                        marginBottom: "8px",
                        textTransform: "uppercase",
                      }}
                    >
                      {index === 0
                        ? "🥇"
                        : index === 1
                        ? "🥈"
                        : index === 2
                        ? "🥉"
                        : index + 1}
                    </div>

                    <div
                      style={{
                        fontSize: "24px",
                        fontWeight: "800",
                        marginBottom: "8px",
                      }}
                    >
                      {player.username}
                    </div>

                    <div
                      style={{
                        color: "#cbd5e1",
                        fontSize: "18px",
                        fontWeight: "700",
                      }}
                    >
                      {player.score} pts
                    </div>
                  </div>
                );
              })}
            </div>

            <div
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: "22px",
                padding: "20px",
              }}
            >
              <h2 style={{ marginTop: 0, marginBottom: "18px", fontSize: "28px" }}>
                Tabla general
              </h2>

              <div style={{ display: "grid", gap: "12px" }}>
                {scores.map((player, index) => {
                  const isCurrentUser =
                    player.username?.toLowerCase() === username.toLowerCase();

                  return (
                    <div
                      key={player.id || `${player.username}-${index}`}
                      style={{
                        background: isCurrentUser
                          ? "rgba(37,99,235,0.14)"
                          : "rgba(255,255,255,0.03)",
                        border: isCurrentUser
                          ? "1px solid rgba(96,165,250,0.24)"
                          : "1px solid rgba(255,255,255,0.06)",
                        borderRadius: "16px",
                        padding: "16px 18px",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        gap: "14px",
                        flexWrap: "wrap",
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                        <div
                          style={{
                            width: "36px",
                            height: "36px",
                            borderRadius: "999px",
                            background: "rgba(255,255,255,0.08)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontWeight: "800",
                          }}
                        >
                          {index + 1}
                        </div>

                        <div>
                          <div style={{ fontWeight: "800", fontSize: "17px" }}>
                            {player.username}
                            {isCurrentUser ? " (Tú)" : ""}
                          </div>
                          <div style={{ color: "#94a3b8", fontSize: "14px" }}>
                            Usuario en competencia
                          </div>
                        </div>
                      </div>

                      <div
                        style={{
                          fontWeight: "800",
                          fontSize: "18px",
                          color: "#e2e8f0",
                        }}
                      >
                        {player.score} pts
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        )}

        {!loading && !error && scores.length === 0 && (
          <div
            style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: "18px",
              padding: "20px",
              color: "#cbd5e1",
            }}
          >
            Aún no hay puntajes registrados.
          </div>
        )}
      </div>
    </div>
  );
}