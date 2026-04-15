import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/client";

export default function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!username || !password || !confirmPassword) {
      setError("Todos los campos son obligatorios");
      return;
    }

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }

    try {
      await api.post("/auth/register", {
        username,
        password,
      });

      setSuccess("Usuario registrado correctamente");

      setTimeout(() => {
        navigate("/login-ranking");
      }, 1200);
    } catch (err) {
      setError(
        err?.response?.data?.message || "No se pudo registrar el usuario"
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
            fontSize: "42px",
            lineHeight: "1.1",
            textAlign: "center",
          }}
        >
          Crear cuenta
        </h1>

        <p
          style={{
            color: "#cbd5e1",
            marginBottom: "28px",
            textAlign: "center",
            lineHeight: "1.6",
            fontSize: "17px",
          }}
        >
          Regístrate para competir en el ranking de Calclab.
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

        <input
          type="password"
          placeholder="Confirmar contraseña"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          style={inputStyle}
        />

        {error && (
          <p style={{ color: "#f87171", marginTop: "0", marginBottom: "16px" }}>
            {error}
          </p>
        )}

        {success && (
          <p style={{ color: "#4ade80", marginTop: "0", marginBottom: "16px" }}>
            {success}
          </p>
        )}

        <button type="submit" style={buttonStyle}>
          Registrarme
        </button>

        <p
          style={{
            marginTop: "18px",
            textAlign: "center",
            color: "#cbd5e1",
          }}
        >
          ¿Ya tienes cuenta?{" "}
          <Link to="/login-ranking" style={{ color: "#60a5fa" }}>
            Inicia sesión
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