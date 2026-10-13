import React from "react";

interface StatItem {
  number: string;
  label: string;
  sublabel: string;
  color: string;
}

const STATS_DATA: StatItem[] = [
  {
    number: "6H",
    label: "De louange & prière non-stop",
    sublabel: "Une atmosphère d'adoration continue",
    color: "#FCD34D", // Or éclatant
  },
  {
    number: "5+",
    label: "Chantres, musiciens & choristes",
    sublabel: "Un collectif d'excellence vocale & scénique",
    color: "#F59E0B", // Or solaire
  },
  {
    number: "100%",
    label: "Gratuit sur inscription",
    sublabel: "Accès libre pour toute la jeunesse",
    color: "#FFAB2E", // Ambre chaleureux
  },
];

export default function StatsSection() {
  return (
    <section
      className="relative z-10"
      style={{
        background: "#1e1611",
        borderTop: "1px solid rgba(255, 255, 255, 0.06)",
        borderBottom: "1px solid rgba(255, 255, 255, 0.06)",
        padding: "clamp(38px, 5vw, 72px) clamp(12px, 3.5vw, 56px)",
      }}
      aria-label="Célébration Night 2026 en chiffres"
    >
      <div style={{ maxWidth: "1320px", margin: "0 auto" }}>
        {/* Titre de la section */}
        <div
          style={{
            marginBottom: "clamp(24px, 3vw, 38px)",
            textAlign: "center",
          }}
        >
          <h2
            style={{
              fontFamily: "var(--font-bebas), 'Humane', sans-serif",
              fontWeight: 700,
              textTransform: "uppercase",
              color: "#ECECEC",
              fontSize: "clamp(34px, 5.5vw, 72px)",
              lineHeight: 0.84,
              margin: 0,
            }}
          >
            2026 en chiffres
          </h2>
        </div>

        {/* Grille des 3 métriques fluides */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 280px), 1fr))",
            gap: "clamp(16px, 2.5vw, 28px)",
          }}
        >
          {STATS_DATA.map((item, idx) => (
            <div
              key={idx}
              className="group transition-all duration-300 hover:border-[#F59E0B]/30"
              style={{
                background: "rgba(255, 255, 255, 0.025)",
                border: "1px solid rgba(255, 255, 255, 0.06)",
                borderRadius: "14px",
                padding: "clamp(24px, 3vw, 34px)",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                textAlign: "left",
              }}
            >
              <div
                style={{
                  fontFamily: "var(--font-bebas), 'Humane', sans-serif",
                  fontWeight: 700,
                  color: item.color,
                  fontSize: "clamp(56px, 7.5vw, 104px)",
                  lineHeight: 0.8,
                  letterSpacing: "0.01em",
                }}
              >
                {item.number}
              </div>

              <div>
                <div
                  style={{
                    fontFamily: "var(--font-montserrat), sans-serif",
                    fontWeight: 700,
                    color: "#FFFFFF",
                    fontSize: "15px",
                    marginTop: "12px",
                    lineHeight: 1.3,
                  }}
                >
                  {item.label}
                </div>

                <div
                  style={{
                    fontFamily: "var(--font-montserrat), sans-serif",
                    color: "#9C8A7F",
                    fontSize: "13.5px",
                    marginTop: "4px",
                    lineHeight: 1.4,
                  }}
                >
                  {item.sublabel}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
