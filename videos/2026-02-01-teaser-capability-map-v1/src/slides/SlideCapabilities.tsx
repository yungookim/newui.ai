import { AbsoluteFill } from "remotion";
import { theme } from "../styles/theme";

export const SlideCapabilities: React.FC = () => {
  const capabilities = [
    { icon: "📦", label: "Entities", desc: "Data models" },
    { icon: "⚡", label: "Actions", desc: "API mutations" },
    { icon: "🔍", label: "Queries", desc: "Data fetching" },
    { icon: "🧩", label: "Components", desc: "UI building blocks" },
  ];

  return (
    <AbsoluteFill
      style={{
        backgroundColor: theme.colors.background,
        justifyContent: "center",
        alignItems: "center",
        padding: 60,
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 48,
        }}
      >
        {/* Header */}
        <div
          style={{
            fontFamily: theme.fonts.heading,
            fontSize: 40,
            fontWeight: 600,
            color: theme.colors.text,
            textAlign: "center",
          }}
        >
          Maps your codebase's capabilities
        </div>

        {/* Capability grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 24,
            width: "100%",
            maxWidth: 700,
          }}
        >
          {capabilities.map((cap) => (
            <div
              key={cap.label}
              style={{
                background: theme.colors.backgroundAlt,
                borderRadius: 16,
                border: `1px solid ${theme.colors.border}`,
                padding: "24px 20px",
              }}
            >
              <div style={{ fontSize: 32, marginBottom: 12 }}>{cap.icon}</div>
              <div
                style={{
                  fontFamily: theme.fonts.heading,
                  fontSize: 24,
                  fontWeight: 600,
                  color: theme.colors.primary,
                  marginBottom: 4,
                }}
              >
                {cap.label}
              </div>
              <div
                style={{
                  fontFamily: theme.fonts.heading,
                  fontSize: 18,
                  color: theme.colors.textSecondary,
                }}
              >
                {cap.desc}
              </div>
            </div>
          ))}
        </div>
      </div>
    </AbsoluteFill>
  );
};
