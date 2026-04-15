import { Link } from "react-router-dom";

export default function BasicDerivativesMenu() {
  const containerStyle = {
    minHeight: "100vh",
    padding: "50px 40px",
    background: "linear-gradient(135deg, #0f172a, #1e293b)",
    color: "white",
  };

  const backButtonStyle = {
    display: "inline-block",
    marginBottom: "24px",
    padding: "10px 16px",
    borderRadius: "12px",
    textDecoration: "none",
    color: "white",
    background: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(255,255,255,0.10)",
  };

  const gridStyle = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "20px",
    marginTop: "30px",
  };

  const cardStyle = {
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "20px",
    padding: "22px",
    textDecoration: "none",
    color: "white",
    display: "block",
    boxShadow: "0 8px 20px rgba(0,0,0,0.25)",
  };

  const titleStyle = {
    fontSize: "20px",
    marginBottom: "8px",
  };

  const textStyle = {
    color: "#cbd5e1",
    lineHeight: "1.6",
    fontSize: "14px",
  };

  return (
    <div style={containerStyle}>
      <Link to="/derivatives" style={backButtonStyle}>
        ← Volver a Derivadas
      </Link>

      <h1 style={{ fontSize: "42px", marginBottom: "10px" }}>
        📗 Derivadas básicas
      </h1>

      <p style={{ color: "#cbd5e1", fontSize: "18px", maxWidth: "780px" }}>
        Selecciona la propiedad básica que quieres utilizar. Cada opción abre una
        pantalla enfocada en ese tipo de ejercicio.
      </p>

      <div style={gridStyle}>
        <Link to="/derivatives/constant" style={cardStyle}>
          <h2 style={titleStyle}>🔢 Constante</h2>
          <p style={textStyle}>Para valores fijos como 8, -3, 15 o 2/3.</p>
        </Link>

        <Link to="/derivatives/sum" style={cardStyle}>
          <h2 style={titleStyle}>➕ Suma</h2>
          <p style={textStyle}>Para expresiones donde los términos se suman.</p>
        </Link>

        <Link to="/derivatives/subtraction" style={cardStyle}>
          <h2 style={titleStyle}>➖ Resta</h2>
          <p style={textStyle}>
            Para expresiones donde los términos se restan.
          </p>
        </Link>

        <Link to="/derivatives/power" style={cardStyle}>
          <h2 style={titleStyle}>📈 Coeficiente por potencia</h2>
          <p style={textStyle}>
            Para ejercicios como 4*x^2, 3*x^6 o -3*x^-2.
          </p>
        </Link>
      </div>
    </div>
  );
}