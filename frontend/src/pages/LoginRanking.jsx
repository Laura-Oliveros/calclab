import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/client";

export default function LoginRanking() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!username || !password) {
      setError("Usuario y contraseña son obligatorios");
      return;
    }

    try {
      const res = await api.post("/auth/login", {
        username,
        password,
      });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("username", res.data.user.username);

      navigate("/ranking");
    } catch (err) {
      setError(
        err?.response?.data?.message || "Usuario o contraseña incorrectos"
      );
    }
  }

  return (
    <div
      style={{
        minHeight: "80vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "40px",
      }}
    >
      <form
        onSubmit={handleSubmit}
        style={{
          width: "100%",
          maxWidth: "500px",
          background: "rgba(255,255,255,0.04)",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: "20px",
          padding: "30px",
          boxShadow: "0 10px 30px rgba(0,0,0,0.25)",
        }}
      >
        <h1
          style={{
            marginTop: 0,
            marginBottom: "16px",
            fontSize: "48px",
            lineHeight: "1.1",
            textAlign: "center",
          }}
        >
          Acceder al ranking
        </h1>

        <p
          style={{
            color: "#cbd5e1",
            marginBottom: "28px",
            textAlign: "center",
            lineHeight: "1.6",
            fontSize: "18px",
          }}
        >
          Inicia sesión para ver el ranking y competir por los mejores puntajes.
        </p>

        <input
          type="text"
          placeholder="Usuario"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={inputStyle}
        />

        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={inputStyle}
        />

        {error && (
          <p style={{ color: "#f87171", marginTop: "0", marginBottom: "16px" }}>
            {error}
          </p>
        )}

        <button type="submit" style={buttonStyle}>
          Entrar
        </button>

        <p
          style={{
            marginTop: "18px",
            textAlign: "center",
            color: "#cbd5e1",
          }}
        >
          ¿No tienes cuenta?{" "}
          <Link to="/register" style={{ color: "#60a5fa", textDecoration: "none" }}>
            Regístrate
          </Link>
        </p>
      </form>
    </div>
  );
}

const inputStyle = {
  width: "100%",
  padding: "14px 16px",
  marginBottom: "14px",
  borderRadius: "12px",
  border: "1px solid rgba(255,255,255,0.12)",
  background: "rgba(255,255,255,0.03)",
  color: "white",
  fontSize: "16px",
  outline: "none",
  boxSizing: "border-box",
};

const buttonStyle = {
  width: "100%",
  padding: "14px 18px",
  borderRadius: "12px",
  border: "none",
  background: "linear-gradient(135deg, #2563eb, #7c3aed)",
  color: "white",
  fontSize: "16px",
  fontWeight: "700",
  cursor: "pointer",
};