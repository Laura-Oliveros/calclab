import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/client";

export default function Register() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!username || !password || !confirmPassword) {
      setError("Completa todos los campos");
      return;
    }

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }

    try {
      setLoading(true);

      const response = await api.post("/auth/register", {
        username,
        password,
      });

      if (response.data?.token) {
        localStorage.setItem("token", response.data.token);
      }

      if (response.data?.user) {
        localStorage.setItem("user", JSON.stringify(response.data.user));
      }

      navigate("/ranking");
    } catch (err) {
      const backendMessage = err?.response?.data?.message;
      setError(backendMessage || "No se pudo registrar el usuario");
    } finally {
      setLoading(false);
    }
  }

  const pageStyle = {
    minHeight: "100vh",
    background:
      "linear-gradient(180deg, #06122f 0%, #091a44 55%, #07122d 100%)",
    padding: "40px 20px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  };

  const cardStyle = {
    width: "100%",
    maxWidth: "560px",
    background: "rgba(20, 31, 61, 0.92)",
    border: "1px solid rgba(108, 138, 255, 0.18)",
    borderRadius: "24px",
    padding: "36px 30px",
    boxShadow: "0 24px 60px rgba(0, 0, 0, 0.35)",
    backdropFilter: "blur(10px)",
  };

  const titleStyle = {
    color: "#ffffff",
    fontSize: "52px",
    fontWeight: 800,
    textAlign: "center",
    margin: "0 0 12px 0",
    lineHeight: 1.05,
  };

  const subtitleStyle = {
    color: "#d9e4ff",
    fontSize: "16px",
    textAlign: "center",
    margin: "0 0 28px 0",
  };

  const inputStyle = {
    width: "100%",
    padding: "18px 16px",
    borderRadius: "14px",
    border: "1px solid rgba(146, 168, 255, 0.18)",
    background: "rgba(255,255,255,0.04)",
    color: "#ffffff",
    fontSize: "18px",
    outline: "none",
    boxSizing: "border-box",
    marginBottom: "16px",
  };

  const buttonStyle = {
    width: "100%",
    padding: "16px",
    border: "none",
    borderRadius: "14px",
    background: "linear-gradient(90deg, #2f67f3 0%, #7b3ff2 100%)",
    color: "#ffffff",
    fontSize: "18px",
    fontWeight: 700,
    cursor: "pointer",
    marginTop: "10px",
    opacity: loading ? 0.7 : 1,
  };

  const errorStyle = {
    color: "#ff6b6b",
    fontSize: "15px",
    margin: "6px 0 8px 0",
  };

  const footerStyle = {
    textAlign: "center",
    marginTop: "22px",
    color: "#e4ebff",
    fontSize: "16px",
  };

  const linkStyle = {
    color: "#7fa8ff",
    textDecoration: "underline",
    fontWeight: 600,
  };

  return (
    <div style={pageStyle}>
      <div style={cardStyle}>
        <h1 style={titleStyle}>Crear cuenta</h1>
        <p style={subtitleStyle}>
          Regístrate para competir en el ranking de Calclab.
        </p>

        <form onSubmit={handleSubmit}>
          <input
            style={inputStyle}
            type="text"
            placeholder="Usuario"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <input
            style={inputStyle}
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <input
            style={inputStyle}
            type="password"
            placeholder="Confirmar contraseña"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />

          {error ? <p style={errorStyle}>{error}</p> : null}

          <button type="submit" style={buttonStyle} disabled={loading}>
            {loading ? "Registrando..." : "Registrarme"}
          </button>
        </form>

        <div style={footerStyle}>
          ¿Ya tienes cuenta?{" "}
          <Link to="/login-ranking" style={linkStyle}>
            Inicia sesión
          </Link>
        </div>
      </div>
    </div>
  );
}