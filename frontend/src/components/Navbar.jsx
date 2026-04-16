import { useState } from "react";
import { Link, useLocation } from "react-router-dom";

const navItems = [
  { label: "Inicio", to: "/" },
  { label: "Derivadas", to: "/derivatives" },
  { label: "Límites", to: "/limits" },
  { label: "Ranking", to: "/ranking" },
  { label: "playLab", to: "/playlab" },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const isMobile = typeof window !== "undefined" && window.innerWidth <= 768;

  return (
    <nav
      style={{
        background: "rgba(15, 23, 42, 0.9)",
        borderBottom: "1px solid rgba(255,255,255,0.08)",
        position: "sticky",
        top: 0,
        backdropFilter: "blur(10px)",
        zIndex: 100,
      }}
    >
      <div
        style={{
          maxWidth: "1280px",
          margin: "0 auto",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: isMobile ? "16px 18px" : "18px 40px",
          gap: "16px",
        }}
      >
        <Link
          to="/"
          style={{
            color: "white",
            textDecoration: "none",
            fontSize: isMobile ? "26px" : "28px",
            fontWeight: "800",
            letterSpacing: "0.5px",
            flexShrink: 0,
          }}
        >
          Calclab
        </Link>

        {isMobile ? (
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            style={{
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.12)",
              color: "white",
              borderRadius: "12px",
              padding: "10px 12px",
              fontSize: "20px",
              cursor: "pointer",
            }}
          >
            ☰
          </button>
        ) : (
          <div style={{ display: "flex", gap: "22px", alignItems: "center" }}>
            {navItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                style={{
                  ...linkStyle,
                  color:
                    location.pathname === item.to ? "#ffffff" : "#e2e8f0",
                }}
              >
                {item.label}
              </Link>
            ))}
          </div>
        )}
      </div>

      {isMobile && menuOpen && (
        <div
          style={{
            display: "grid",
            gap: "10px",
            padding: "0 18px 16px",
            borderTop: "1px solid rgba(255,255,255,0.08)",
            background: "rgba(15, 23, 42, 0.98)",
          }}
        >
          {navItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              onClick={() => setMenuOpen(false)}
              style={{
                ...mobileLinkStyle,
                color:
                  location.pathname === item.to ? "#ffffff" : "#e2e8f0",
                background:
                  location.pathname === item.to
                    ? "rgba(255,255,255,0.08)"
                    : "transparent",
              }}
            >
              {item.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}

const linkStyle = {
  color: "#e2e8f0",
  textDecoration: "none",
  fontSize: "16px",
  fontWeight: "600",
};

const mobileLinkStyle = {
  color: "#e2e8f0",
  textDecoration: "none",
  fontSize: "17px",
  fontWeight: "600",
  padding: "12px 10px",
  borderRadius: "12px",
};