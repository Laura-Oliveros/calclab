import { Link } from "react-router-dom";

export default function DerivativesMenu() {
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
        📘 Menú de Derivadas
      </h1>

      <p style={{ color: "#cbd5e1", fontSize: "18px", maxWidth: "780px" }}>
        Selecciona el tipo de derivada que quieres resolver. Cada opción te lleva
        a una calculadora enfocada en ese tema para que no te pierdas.
      </p>

      <div style={gridStyle}>
        <Link to="/derivatives/basic" style={cardStyle}>
          <h2 style={titleStyle}>📗 Derivadas básicas</h2>
          <p style={textStyle}>
            Constante, suma, resta y coeficiente por potencia.
          </p>
        </Link>

        <Link to="/derivatives/product" style={cardStyle}>
          <h2 style={titleStyle}>✖️ Propiedad del producto</h2>
          <p style={textStyle}>
            Resuelve ejercicios donde una función multiplica a otra.
          </p>
        </Link>

        <Link to="/derivatives/quotient" style={cardStyle}>
          <h2 style={titleStyle}>➗ Propiedad de la división</h2>
          <p style={textStyle}>
            Resuelve derivadas con numerador y denominador paso a paso.
          </p>
        </Link>

        <Link to="/derivatives/successive" style={cardStyle}>
          <h2 style={titleStyle}>🔁 Derivadas sucesivas</h2>
          <p style={textStyle}>
            Calcula primera, segunda, tercera derivada y más.
          </p>
        </Link>
      </div>
    </div>
  );
}