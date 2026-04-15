import { Link } from "react-router-dom";

export default function LimitsMenu() {
  const containerStyle = {
    minHeight: "100vh",
    padding: "50px 40px",
    background: "linear-gradient(135deg, #0f172a, #1e293b)",
    color: "white",
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
      <h1 style={{ fontSize: "42px", marginBottom: "10px" }}>
        📙 Menú de Límites
      </h1>

      <p style={{ color: "#cbd5e1", fontSize: "18px", maxWidth: "780px" }}>
        Selecciona el tipo de límite que quieres trabajar. Cada opción te lleva
        a una pantalla guiada para que no te pierdas.
      </p>

      <div style={gridStyle}>
        <Link to="/limits/direct" style={cardStyle}>
          <h2 style={titleStyle}>🔢 Sustitución directa</h2>
          <p style={textStyle}>
            Para ejercicios donde se puede reemplazar x directamente.
          </p>
        </Link>

        <Link to="/limits/indeterminate" style={cardStyle}>
          <h2 style={titleStyle}>♾️ Indeterminaciones</h2>
          <p style={textStyle}>
            Para casos tipo 0/0 donde toca simplificar o analizar más.
          </p>
        </Link>

        <Link to="/limits/roots" style={cardStyle}>
          <h2 style={titleStyle}>√ Límites con raíces</h2>
          <p style={textStyle}>
            Para ejercicios con raíces, racionalización y simplificación.
          </p>
        </Link>

        <Link to="/limits/infinity" style={cardStyle}>
          <h2 style={titleStyle}>🚀 Límites al infinito</h2>
          <p style={textStyle}>
            Para funciones cuando x tiende a infinito o menos infinito.
          </p>
        </Link>

    
      </div>
    </div>
  );
}