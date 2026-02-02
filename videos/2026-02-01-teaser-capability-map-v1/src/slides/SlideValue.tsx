import { AbsoluteFill } from "remotion";
import { theme } from "../styles/theme";

export const SlideValue: React.FC = () => {
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
          gap: 40,
          maxWidth: 900,
        }}
      >
        {/* Header */}
        <div
          style={{
            fontFamily: theme.fonts.heading,
            fontSize: 36,
            fontWeight: 600,
            color: theme.colors.text,
            textAlign: "center",
            lineHeight: 1.3,
          }}
        >
          One command. Full understanding.
        </div>

        {/* Value props */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 20,
            width: "100%",
          }}
        >
          {[
            {
              icon: "⚡",
              text: "Users can generate custom features within your application with prompt",
            },
            {
              icon: "📉",
              text: "Reduce feature request backlogs for your engineering team",
            },
            {
              icon: "🛡️",
              text: "Capability map helps agentic UI generation that's compatible with existing functionalities",
            },
          ].map((item, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 16,
                background: theme.colors.backgroundAlt,
                borderRadius: 12,
                padding: "16px 20px",
                border: `1px solid ${theme.colors.border}`,
              }}
            >
              <span style={{ fontSize: 28 }}>{item.icon}</span>
              <span
                style={{
                  fontFamily: theme.fonts.heading,
                  fontSize: 22,
                  color: theme.colors.text,
                }}
              >
                {item.text}
              </span>
            </div>
          ))}
        </div>

        {/* Tagline */}
        <div
          style={{
            fontFamily: theme.fonts.heading,
            fontSize: 24,
            fontWeight: 500,
            color: theme.colors.primary,
            textAlign: "center",
            marginTop: 8,
            fontStyle: "italic",
          }}
        >
          Like a forward deployed engineer at every customer's site.
        </div>
      </div>
    </AbsoluteFill>
  );
};
