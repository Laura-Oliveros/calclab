import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "18px 40px",
        background: "rgba(15, 23, 42, 0.9)",
        borderBottom: "1px solid rgba(255,255,255,0.08)",
        position: "sticky",
        top: 0,
        backdropFilter: "blur(10px)",
        zIndex: 100,
      }}
    >
      <Link
        to="/"
        style={{
          color: "white",
          textDecoration: "none",
          fontSize: "28px",
          fontWeight: "800",
          letterSpacing: "0.5px",
        }}
      >
        Calclab 
      </Link>

      <div style={{ display: "flex", gap: "22px", flexWrap: "wrap" }}>
        <Link to="/" style={linkStyle}>Inicio</Link>
        <Link to="/derivatives" style={linkStyle}>Derivadas</Link>
        <Link to="/limits" style={linkStyle}>Límites</Link>
        <Link to="/ranking" style={linkStyle}>Ranking</Link>
        <Link to="/playlab" style={linkStyle}>playLab</Link>
      </div>
    </nav>
  );
}

const linkStyle = {
  color: "#e2e8f0",
  textDecoration: "none",
  fontSize: "16px",
  fontWeight: "600",
};